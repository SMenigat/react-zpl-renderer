import { FC, useEffect, useRef } from "react";
import { ZPLParser } from "zpl-js/src/core/parser";
import { ZPLRenderer } from "zpl-js/src/core/renderer";

type ZplRendererProps = {
  zpl: string;
  width?: number;
  height?: number;
  "data-component"?: string;
} & React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const ZplRenderer: FC<ZplRendererProps> = ({
  zpl,
  width = 400,
  height = 600,
  "data-component": dataComponent = "ZplRenderer",
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    try {
      const parser = new ZPLParser(zpl);
      const parsedZpl = parser.parse();

      if (parsedZpl.label && canvasRef.current) {
        // Clear the canvas before rendering using the props dimensions
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
        }

        // Render the ZPL content (this may modify canvas styles)
        const zplRenderer = new ZPLRenderer(canvasRef.current);
        zplRenderer.render(parsedZpl.label);

        // Override/fix the canvas dimensions after rendering
        const canvasWidth = `${width}px`;
        const canvasHeight = `${height}px`;

        // Set actual canvas dimensions
        canvasRef.current.style.width = canvasWidth;
        canvasRef.current.style.height = canvasHeight;

        // Apply responsive CSS while maintaining aspect ratio
        canvasRef.current.style.maxWidth = "100%";
        canvasRef.current.style.maxHeight = "100%";
        canvasRef.current.style.objectFit = "contain";
      }
    } catch (error) {
      console.error("Error rendering ZPL:", error);
    }
  }, [zpl, width, height]);

  return (
    <canvas
      ref={canvasRef}
      data-component={dataComponent}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default ZplRenderer;
