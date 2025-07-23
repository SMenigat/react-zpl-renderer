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
        // Clear the canvas before rendering
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }

        const zplRenderer = new ZPLRenderer(canvasRef.current);
        zplRenderer.render(parsedZpl.label);

        // Set the canvas dimensions in pixels
        const canvasWidth = `${width}px`;
        const canvasHeight = `${height}px`;

        // Set actual canvas dimensions
        canvasRef.current.width = width;
        canvasRef.current.height = height;
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
