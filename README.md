# Release Notes - MotorAIClientInstaller

## 概要

このリポジトリは、プライベートリポジトリ [motor-ai-jp/MotorAIClientInstaller](https://github.com/motor-ai-jp/MotorAIClientInstaller) のリリースノートを GitHub Pages で公開するためのものです。

10分おきに本体リポのリリース情報を取得し、公開済みリリースのみを一覧表示します。

## Pages の URL

<https://motor-ai-jp.github.io/release-notes/>

## リリース公開の手順

1. 本体リポ (`MotorAIClientInstaller`) のデプロイ workflow を実行すると、**ドラフトリリース**が自動作成されます
2. 本体リポの [Releases](https://github.com/motor-ai-jp/MotorAIClientInstaller/releases) 画面でドラフトの内容を確認します
3. 問題なければ **「Publish release」** ボタンを押して公開します
4. 最大10分以内に GitHub Pages に反映されます

## 初回セットアップ

1. **Fine-grained Personal Access Token (PAT) の作成**
   - GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Repository access: `motor-ai-jp/MotorAIClientInstaller` のみ
   - Permissions: `Contents: Read-only`

2. **`SOURCE_REPO_TOKEN` の登録**
   - このリポジトリの Settings → Secrets and variables → Actions → New repository secret
   - Name: `SOURCE_REPO_TOKEN`
   - Value: 上記で作成した PAT

3. **Pages の設定**
   - このリポジトリの Settings → Pages → Build and deployment → Source を **"GitHub Actions"** に設定

## PAT 更新手順

PAT には有効期限があります。期限が切れると workflow がリリース情報を取得できなくなります。

1. GitHub → Settings → Developer settings → Personal access tokens で新しいトークンを作成（または既存を再生成）
2. このリポジトリの Settings → Secrets and variables → Actions → `SOURCE_REPO_TOKEN` を更新

## 即時反映が必要な場合

本構成は schedule 方式のため最大10分の遅延があります。即座に反映したい場合は、このリポジトリの Actions タブから **「Publish Release Notes」** workflow を手動実行（`workflow_dispatch`）してください。

`repository_dispatch` 方式に切り替えることで、本体リポのリリース公開と同時に即時反映する構成にすることも可能です。

## 注意事項

- **schedule の自動停止**: リポジトリに60日間 activity がないと GitHub が schedule を自動停止します。停止した場合は `workflow_dispatch` で手動実行すれば復活します。定期的にコミットや手動実行を行ってください。
- **schedule の遅延**: GitHub Actions の schedule は GitHub 側の負荷状況により数分遅れることがあります（GitHub の仕様）。
- **アセットのダウンロード**: 本体リポがプライベートのため、リリースに添付されたアセット（インストーラー等）のダウンロード URL は Pages には掲載していません。アセットは本体リポの Releases ページから直接ダウンロードしてください。
