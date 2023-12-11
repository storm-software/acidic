import styles from "./ui-webview.module.css";

/* eslint-disable-next-line */
export interface UiWebviewProps {}

export function UiWebview(props: UiWebviewProps) {
  return (
    <div className={styles["container"]}>
      <h1>Welcome to UiWebview!</h1>
    </div>
  );
}

export default UiWebview;

if (import.meta.vitest) {
  // add tests related to your file here
  // For more information please visit the Vitest docs site here: https://vitest.dev/guide/in-source.html

  const { it, expect, beforeEach } = import.meta.vitest;
  let render: typeof import("@testing-library/react").render;

  beforeEach(async () => {
    render = (await import("@testing-library/react")).render;
  });

  it("should render successfully", () => {
    const { baseElement } = render(<UiWebview />);
    expect(baseElement).toBeTruthy();
  });
}
