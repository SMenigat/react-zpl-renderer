# react-zpl-renderer

Render ZPL label codes as canvas

## Installation

```bash
npm install react-zpl-renderer
# or
yarn add react-zpl-renderer
```

## Usage

```tsx
import ZplRenderer from "react-zpl-renderer";

function MyComponent() {
  const zplCode = `
    ^XA
    ^FO20,20^A0N,25,25^FDHello World^FS
    ^XZ
  `;

  return (
    <ZplRenderer
      zpl={zplCode}
      printDensity={8}
      labelWidthMM={100}
      labelHeightMM={150}
    />
  );
}
```

## Props

- `zpl` (string): The ZPL code to render
- `printDensity` (6 | 8 | 12 | 24): Print density in dots per mm (default: 8)
- `labelWidthMM` (number): Label width in millimeters (default: 100)
- `labelHeightMM` (number): Label height in millimeters (default: 150)
- `data-component` (string): Data attribute for testing (default: "ZplRenderer")
- All other canvas HTML attributes are supported

## Next.js Usage

This library works with Next.js out of the box. For canvas-based components like this one, it's recommended to disable SSR:

```tsx
import dynamic from "next/dynamic";

const ZplRenderer = dynamic(() => import("react-zpl-renderer"), {
  ssr: false,
});

function MyComponent() {
  const zplCode = `
    ^XA
    ^FO20,20^A0N,25,25^FDHello World^FS
    ^XZ
  `;

  return (
    <ZplRenderer
      zpl={zplCode}
      printDensity={8}
      labelWidthMM={100}
      labelHeightMM={150}
    />
  );
}
```
