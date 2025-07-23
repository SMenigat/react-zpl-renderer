import React from "react";
import { ZPLParser } from "zpl-js/src/core/parser";
import { ZPLRenderer } from "zpl-js/src/core/renderer";

type ZplRendererProps = {
  zpl: string;
  printDensity?: 6 | 8 | 12 | 24;
  labelWidthMM?: number;
  labelHeightMM?: number;
  "data-component"?: string;
} & React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const ZplRenderer: React.FC<ZplRendererProps> = ({
  zpl,
  printDensity = 8,
  labelWidthMM = 100,
  labelHeightMM = 150,
  "data-component": dataComponent = "ZplRenderer",
  ...props
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    try {
      if (canvasRef.current) {
        const parser = new ZPLParser(zpl);
        const parsedZpl = parser.parse();

        if (parsedZpl.label) {
          const zplRenderer = new ZPLRenderer(canvasRef.current);
          zplRenderer.render(parsedZpl.label);

          // Set the canvas dimensions based on label size and print density
          const canvasWidth = `${labelWidthMM * printDensity}px`;
          const canvasHeight = `${labelHeightMM * printDensity}px`;

          // Set actual canvas dimensions
          canvasRef.current.style.width = canvasWidth;
          canvasRef.current.style.height = canvasHeight;

          // Apply responsive CSS while maintaining aspect ratio
          canvasRef.current.style.maxWidth = canvasWidth;
          canvasRef.current.style.maxHeight = canvasHeight;
          canvasRef.current.style.objectFit = "contain";
        }
      }
    } catch (error) {
      console.error("Error rendering ZPL:", error);
    }
  }, [zpl, canvasRef, printDensity, labelWidthMM, labelHeightMM]);

  return <canvas ref={canvasRef} data-component={dataComponent} {...props} />;
};

export default ZplRenderer;
