import ZplRenderer from './index';

const DemoZPL = `
^XA

^FX Top section with logo, name and address.
^CF0,60
^FO50,50^GB100,100,100^FS
^FO75,75^FR^GB100,100,100^FS
^FO93,93^GB40,40,40^FS
^FO220,50^FDIntershipping, Inc.^FS
^CF0,30
^FO220,115^FD1000 Shipping Lane^FS
^FO220,155^FDShelbyville TN 38102^FS
^FO220,195^FDUnited States (USA)^FS
^FO50,250^GB700,3,3^FS

^FX Second section with recipient address and permit information.
^CFA,30
^FO50,300^FDJohn Doe^FS
^FO50,340^FD100 Main Street^FS
^FO50,380^FDSpringfield TN 39021^FS
^FO50,420^FDUnited States (USA)^FS
^CFA,15
^FO600,300^GB150,150,3^FS
^FO638,340^FDPermit^FS
^FO638,390^FD123456^FS
^FO50,500^GB700,3,3^FS

^FX Third section with bar code.
^BY5,2,270
^FO100,550^BC^FD12345678^FS

^FX Fourth section (the two boxes on the bottom).
^FO50,900^GB700,250,3^FS
^FO400,900^GB3,250,3^FS
^CF0,40
^FO100,960^FDCtr. X34B-1^FS
^FO100,1010^FDREF1 F00B47^FS
^FO100,1060^FDREF2 BL4H8^FS
^CF0,190
^FO470,955^FDCA^FS

^XZ
`.trim();

const defaultProps = () => ({
  zpl: DemoZPL,
  width: 200,
  height: 300,
});

const simpleZPL = `
^XA
^CF0,60
^FO50,50^FDHello World^FS
^XZ
`.trim();

const emptyZPL = `
^XA
^XZ
`.trim();

describe('<ZplRenderer />', () => {
  it('renders with default props', () => {
    cy.mount(<ZplRenderer {...defaultProps()} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist')
      .should('have.prop', 'tagName', 'CANVAS');
  });

  it('renders with custom dimensions', () => {
    cy.mount(<ZplRenderer zpl={simpleZPL} width={400} height={600} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist')
      .should('have.css', 'width', '400px')
      .should('have.css', 'height', '600px');
  });

  it('renders with default dimensions when width and height are not provided', () => {
    cy.mount(<ZplRenderer zpl={simpleZPL} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist')
      .should('have.css', 'width', '400px')
      .should('have.css', 'height', '600px');
  });

  it('renders with custom data-component attribute', () => {
    cy.mount(<ZplRenderer zpl={simpleZPL} data-component="CustomZplRenderer" />)
      .get('[data-component="CustomZplRenderer"]')
      .should('exist');
  });

  it('passes through additional canvas props', () => {
    cy.mount(
      <ZplRenderer
        zpl={simpleZPL}
        className="custom-class"
        style={{ border: '1px solid red' }}
        data-testid="custom-canvas"
      />
    )
      .get('[data-component="ZplRenderer"]')
      .should('have.class', 'custom-class')
      .should('have.css', 'border', '1px solid rgb(255, 0, 0)')
      .should('have.attr', 'data-testid', 'custom-canvas');
  });

  it('handles empty ZPL content', () => {
    cy.mount(<ZplRenderer zpl={emptyZPL} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist');
  });

  it('handles simple ZPL content', () => {
    cy.mount(<ZplRenderer zpl={simpleZPL} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist');
  });

  it('handles complex ZPL content with multiple sections', () => {
    cy.mount(<ZplRenderer {...defaultProps()} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist');
  });

  it('updates when ZPL content changes', () => {
    cy.mount(<ZplRenderer zpl={simpleZPL} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist')
      .then(() => {
        cy.mount(<ZplRenderer zpl={DemoZPL} />)
          .get('[data-component="ZplRenderer"]')
          .should('exist');
      });
  });

  it('updates when dimensions change', () => {
    const initialWidth = 200;
    const initialHeight = 300;
    const newWidth = 500;
    const newHeight = 700;

    cy.mount(
      <ZplRenderer
        zpl={simpleZPL}
        width={initialWidth}
        height={initialHeight}
      />
    )
      .get('[data-component="ZplRenderer"]')
      .should('have.css', 'width', `${initialWidth}px`)
      .should('have.css', 'height', `${initialHeight}px`)
      .then(() => {
        cy.mount(
          <ZplRenderer zpl={simpleZPL} width={newWidth} height={newHeight} />
        )
          .get('[data-component="ZplRenderer"]')
          .should(($canvas) => {
            // Check that the canvas dimensions were updated (allowing for some variance due to scaling)
            const actualWidth = parseInt($canvas.css('width'));
            const actualHeight = parseInt($canvas.css('height'));

            // The canvas should reflect the new dimensions or at least be different from initial
            expect(actualWidth).to.be.greaterThan(initialWidth);
            expect(actualHeight).to.be.greaterThan(initialHeight);
          });
      });
  });

  it('applies responsive CSS properties', () => {
    cy.mount(<ZplRenderer zpl={simpleZPL} />)
      .get('[data-component="ZplRenderer"]')
      .should('have.css', 'max-width', '100%')
      .should('have.css', 'max-height', '100%')
      .should('have.css', 'object-fit', 'contain');
  });

  it('handles invalid ZPL gracefully', () => {
    // This test ensures the component doesn't crash with malformed ZPL
    const invalidZPL = 'invalid zpl content without proper format';

    cy.mount(<ZplRenderer zpl={invalidZPL} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist');
  });

  it('handles ZPL with special characters', () => {
    const zplWithSpecialChars = `
^XA
^CF0,60
^FO50,50^FDSpecial: @#$%^&*()^FS
^XZ
    `.trim();

    cy.mount(<ZplRenderer zpl={zplWithSpecialChars} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist');
  });

  it('maintains canvas aspect ratio', () => {
    cy.mount(<ZplRenderer zpl={simpleZPL} width={200} height={400} />)
      .get('[data-component="ZplRenderer"]')
      .should('exist')
      .then(($canvas) => {
        const canvas = $canvas[0] as HTMLCanvasElement;
        expect(canvas.style.width).to.equal('200px');
        expect(canvas.style.height).to.equal('400px');
      });
  });
});
