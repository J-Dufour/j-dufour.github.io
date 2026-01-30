import hljs from "highlight.js/lib/core";

import javascript from "highlight.js/lib/languages/javascript";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import html from "highlight.js/lib/languages/xml";
import c from "highlight.js/lib/languages/c";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("java", java);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("html", html);
hljs.registerLanguage("c", c);

globalThis.setHighlight = (e: HTMLElement) => {
  e.innerHTML = hljs.highlight(`<div><h1>Hello, world!</h1></div>`, {
    language: "html",
  }).value;
};

const helloWorlds = {
  javascript: `\
function main() {
  console.log("Hello, world!");
}`,
  go: `\
func main() {
  fmt.Println("Hello, world!")
}`,
  rust: `\
fn main() {
  println!("Hello, world!");
}`,
  java: `\
class IntroductionFactory {
  public static void main(String[] args) {
    System.out.println("Hello, world!");
  }
}`,
  python: `\
if __name__ = "__main__":
  print("Hello, world!")`,
  bash: `\
echo "Hello, world!"`,
  html: `\
<!doctype html>
<html>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>`,
  c: `\
#include <stdio.h>

int main() {
  printf("Hello, world!\\n");
  return 0;
}`,
};

let availableLangs = Object.keys(helloWorlds);

globalThis.resetAvailableLangs = () => {
  availableLangs = Object.keys(helloWorlds);
};
globalThis.getRandomGreeting = (oldLang: string | undefined) => {
  const idx = Math.floor(Math.random() * availableLangs.length);
  const lang = availableLangs[idx];
  availableLangs.splice(idx, 1, ...(oldLang ? [oldLang] : []));

  return [lang, helloWorlds[lang]];
};

globalThis.startHighlight = (e: HTMLElement) => {
  e.removeAttribute("data-highlighted");
  hljs.highlightElement(e);
};

let hovering = false;
let currentLoopPromise: Promise<void> | null = null;

globalThis.startCursor = (g: SVGGElement) => {
  hovering = true;
  g.style.transitionTimingFunction = "linear";
  currentLoopPromise = loop(g);
};

const loop = async (g: SVGGElement) => {
  const steps = 48;
  const xRadiusMultiplier = 0.5;
  const yRadiusMultiplier = 0.75;

  let i = 16;
  while (hovering) {
    const progress = (i * 2 * Math.PI) / steps;

    const x = Math.round(
      (xRadiusMultiplier * (100 * Math.cos(progress) + 100)) / 2 +
        50 * (1 - xRadiusMultiplier),
    );
    const y = Math.round(
      (yRadiusMultiplier * (100 * Math.sin(progress) + 100)) / 2 +
        50 * (1 - yRadiusMultiplier),
    );

    g.style.transform = `translate(${x}%, ${y}%)`;

    await new Promise((resolve) => setTimeout(resolve, 100));
    i++;
    i %= steps;
  }
};

globalThis.stopCursor = async (g: SVGGElement) => {
  hovering = false;

  if (currentLoopPromise) await currentLoopPromise;

  g.style.transitionTimingFunction = "var(--ease-out)";
  g.style.transform = `translate(20%, 60%)`;
};

let navlinks: HTMLElement[] = [];
globalThis.addToLinks = (e: HTMLElement) => {
  navlinks.push(e);
};

globalThis.generateCodeSnippets = () => {
  return [
    generateCodeSnip(false, false),
    generateCodeSnip(false, true),
    generateCodeSnip(true, false),
    generateCodeSnip(true, true),
  ];
};

const generateCodeSnip = (left: boolean, top: boolean): HTMLPreElement => {
  const codeSnip = document.createElement("pre");
  codeSnip.classList.add(
    "absolute",
    "top-[50vh]",
    "left-[50vw]",
    "w-64",
    "md:w-128",
    "h-48",
    "md:h-96",
    "perspective-distant",
    "transition-all",
    "transform-3d",
    "backface-hidden",
    "duration-6000",
    "ease-out",
    "code-snippet",
  );
  codeSnip.setAttribute(
    "_",
    `\
init transition 
  *transform from 'scale(0%) translate(-50%, -50%)' to 'scale(100%) translate(-50%, -50%) translate(${left ? "-20" : "30"}vw, ${top ? "-30" : "30"}vh)' 
  *opacity from 0% to 100%  
  using 'all 5s cubic-bezier(0, 1, 0, 1)'
end
on kill  transition *opacity to 0 using 'all 1s ease' then settle then remove me 
  `,
  );
  const innerCode = document.createElement("code");
  innerCode.classList.add(
    left ? "-rotate-y-20" : "rotate-y-20",
    top ? "rotate-x-20" : "-rotate-x-20",
    "text-xs",
    "md:text-lg",
  );
  innerCode.setAttribute(
    "_",
    `\
init wait random from [250ms, 750ms, 1.25s, 1.75s] then add .animate-sway to me then
repeat forever 
  call getRandomGreeting(:lang) then set :read to it
  then set :lang to :read[0]
  then set :txt to :read[1]
  then set :className to 'language-'
  then append :lang to :className
  then call my classList's add(:className)
  then repeat for c in :txt
    append c to my textContent
    call startHighlight(me)
    wait random from [50ms, 120ms]
  end
  then wait random from [2s, 3s, 4s, 5s, 6s]
  then set :i to the length of :txt - 1
  then repeat while :i >= 0
    pick characters start to :i from :txt 
    then set my textContent to it
    call startHighlight(me)
    wait 30ms
    decrement :i
  end
  then call my classList's remove(:className)
end`,
  );
  codeSnip.append(innerCode);

  return codeSnip;
};
