# CLAUDE.md — Osteria Nascosta

## コーディング規約

### 外部ライブラリ方針
- 外部ライブラリは目的が明確な場合に使用可（Tailwind, jQuery, GSAP 等）
- ただし、バニラ JS / CSS で同等の品質を実現できる場合はネイティブ実装を優先
- CDN 依存は最小限に抑え、ページ読み込み速度を意識すること

### CSS 規約
- **BEM 命名**を厳守: `.block__element--modifier`
- デザイントークンは CSS カスタムプロパティ（`:root`）で一元管理
- マジックナンバー禁止 — すべての値はカスタムプロパティを参照

### JavaScript 規約
- `var` 禁止 — `const` を基本とし、再代入が必要な場合のみ `let`
- DOM 操作は `DOMContentLoaded` 後に実行
- スクロールイベントリスナーは `{ passive: true }` を付与
- フォームバリデーションはネイティブ実装（`novalidate` + JS 制御）

### アクセシビリティ
- セマンティック HTML を優先（`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`）
- すべての `<img>` に `alt` 属性を付与
- インタラクティブ要素には `aria-label` を付与

### パフォーマンス
- ヒーロー以外の画像には `loading="lazy"` を付与
- スクロールイベントリスナーは `{ passive: true }`
