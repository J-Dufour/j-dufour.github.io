import * as wasm from "glyphimg";

const outputCanvas = document.getElementById("canvas") as HTMLCanvasElement;

const font = new FontFace("FiraCode", "url(/FiraMono-Regular.ttf)");
await font.load().then((loadedFont) => {
  document.fonts.add(loadedFont);
});

globalThis.englishChars = () =>
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
globalThis.ASCIIChars = () =>
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

globalThis.drawImage = async (
  imageInput: HTMLInputElement,
  width: number,
  alphabet: string,
  isAnimated: boolean,
) => {
  const imgFile = imageInput.files?.[0] ?? null;

  const bytes = await imgFile?.bytes();

  if (imgFile && bytes) {
    await wasm.default();
    const image = wasm.image_from_bytes(bytes);
    const imageBitmap = await window.createImageBitmap(imgFile);

    const fontBytes = await fetch("/FiraMono-Regular.ttf").then((f) =>
      f.bytes(),
    );
    const wasmFont = wasm.font_from_bytes(fontBytes, 24);

    if (image && wasmFont) {
      const bgMode = wasm.background_mode_none();
      const chars = wasm.transform_image_to_chars(
        image,
        wasmFont,
        alphabet,
        width,
        bgMode,
        30,
        3,
      );
      if (chars) {
        outputCanvas.width = wasmFont.width() * width;
        outputCanvas.height = wasmFont.height() * (chars?.length / width);

        const chunks: Blob[] = [];
        const stream = outputCanvas.captureStream(60);
        const recorder = new MediaRecorder(stream, {
          mimeType: "video/webm; codecs=vp8",
        });
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = (e) => {
          const blob = new Blob(chunks, { type: recorder.mimeType });

          const url = window.URL.createObjectURL(blob);
          console.log(url);
        };
        recorder.start();

        const ctx = outputCanvas.getContext("2d");

        const chars_with_positions = chars.map((char, i) => {
          const x = i % width;
          const y = Math.floor(i / width);
          return { char, x, y };
        });

        if (isAnimated) {
          // shuffle
          for (let i = chars_with_positions.length; i > 0; i--) {
            const idx = Math.floor(Math.random() * i);
            [chars_with_positions[i - 1], chars_with_positions[idx]] = [
              chars_with_positions[idx],
              chars_with_positions[i - 1],
            ];
          }
        }

        if (ctx) {
          ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
          ctx.drawImage(
            imageBitmap,
            0,
            0,
            imageBitmap.width,
            imageBitmap.height,
            0,
            0,
            outputCanvas.width * 1.05,
            outputCanvas.height + 14,
          );

          ctx.font = `24px ${font.family}`;

          for (const { char, x, y } of chars_with_positions) {
            ctx.fillStyle = `rgb(${char.bg?.r ?? 0} ${char.bg?.g ?? 0} ${char.bg?.b ?? 0})`;
            ctx.fillRect(
              x * wasmFont.width(),
              y * wasmFont.height(),
              wasmFont.width(),
              wasmFont.height(),
            );
            ctx.fillStyle = `rgb(${char.fg.r} ${char.fg.g} ${char.fg.b})`;
            ctx.fillText(
              char.char,
              x * wasmFont.width(),
              y * wasmFont.height() + wasmFont.height(),
            );
            if (isAnimated) {
              await new Promise((r) => requestAnimationFrame(r));
            }
          }

          await new Promise<void>((r) =>
            setTimeout(() => {
              recorder.stop();
              r();
            }, 1000),
          );
        }
      }
    }
  }
};
