import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// シンプルなテスト用コンポーネント
function SampleComponent({ text }: { text: string }) {
  return <div data-testid="sample">{text}</div>;
}

describe("テスト環境の確認", () => {
  it("Vitestが正常に動作する", () => {
    expect(1 + 1).toBe(2);
  });

  it("React Testing Libraryが正常に動作する", () => {
    render(<SampleComponent text="Hello, Test!" />);
    expect(screen.getByTestId("sample")).toBeInTheDocument();
    expect(screen.getByText("Hello, Test!")).toBeInTheDocument();
  });
});
