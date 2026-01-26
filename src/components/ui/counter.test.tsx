import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./counter";

describe("Counter", () => {
  it("初期値が表示される", () => {
    render(<Counter />);
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("initialValueを指定すると初期値が変わる", () => {
    render(<Counter initialValue={10} />);
    expect(screen.getByTestId("count")).toHaveTextContent("10");
  });

  it("+1ボタンをクリックするとカウントが1増える", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    // 初期値は0
    expect(screen.getByTestId("count")).toHaveTextContent("0");

    // +1ボタンをクリック
    await user.click(screen.getByTestId("increment-button"));

    // カウントが1になる
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("-1ボタンをクリックするとカウントが1減る", async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={5} />);

    // 初期値は5
    expect(screen.getByTestId("count")).toHaveTextContent("5");

    // -1ボタンをクリック
    await user.click(screen.getByTestId("decrement-button"));

    // カウントが4になる
    expect(screen.getByTestId("count")).toHaveTextContent("4");
  });

  it("連続クリックでカウントが増え続ける", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByTestId("increment-button");

    // 3回クリック
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);

    // カウントが3になる
    expect(screen.getByTestId("count")).toHaveTextContent("3");
  });
});
