# onlinegame

## 概要
このプロジェクトは2つのScratchX上で動くプログラムがネットワーク越しに対戦できるシューティングゲームのサンプルです。
ネットワークで接続された2台のPC上のScratchXからサーバプログラムに接続し動作します。
以下のプログラムを含んでいます。

1. ScratchX上で動作するプログラム（クライアント）
2. ScratchXに読み込ませるエクステンションファイル
3. サーバプログラム

## 必要なもの
- ScratchXにアクセスできる環境
- Node.js
- MySQLサーバ
- Git

## 環境構築手順
サーバプログラムをローカルPCに立てて環境構築する手順を示します。

1. プロジェクトファイル一式のダウンロード(git clone)

  プロジェクトのファイル一式をローカルPCの任意の場所に保存（クローン）します。

  ```
  $ git clone https://github.com/awwa/onlinegame
  ```

2. DBのアクセス環境を整える

  クローンしたプロジェクトフォルダに移動して、.env.exampleを.envというファイル名でコピーします。

  ```
  $ cd onlinegame
  $ cp .env.example .env
  $ vi .env
  DATABASE_URL="mysql://onlinegame:Sample!Password123@localhost/onlinegame?reconnect=true"
  ```

  .envファイルを編集して`DATABASE_URL`環境変数にDBアクセスに必要な設定を行います。また、ここで設定したデータベース（この例ではデータベース名：onlinegame）を作成しておきます。詳しくは[こちら](https://www.npmjs.com/package/mysql#connection-options)を参照してください。

3. DBテーブルの作成

  クローンしたプロジェクトフォルダに移動して、db-migrateによりDBにテーブルを作成します。

  ```
  $ cd onlinegame
  $ npm install
  $ ./node_modules/db-migrate/bin/db-migrate up
  [INFO] Processed migration 20171015091819-add-games
  [INFO] Done
  ```

4. Node.jsサーバアプリケーションの起動

  サーバアプリケーションを起動します。

  ```
  $ npm start
  ```

  ブラウザで`http://localhost:3000/`にアクセスして`Cannot GET /`のメッセージが表示されることを確認します。

5. ScratchXプロジェクトファイル(onlinegame.sbx)の読み込み

  ブラウザで[ScratchX](http://scratchx.org/)にアクセスします。メニューの[File > Load Project]を選択して、プロジェクトフォルダ配下の`client/onlinegame.sbx`を選択して読み込みます。「Replace contents of the current project?」と聞かれるので「OK」を選択します。「The extensions on this site are experimental」と聞かれたら「I understand, continue」を選択します。

6. エクステンションファイルの読み込み

  ScratchXの画面上で[Scripts > More Blocks]を選択し、[Load experimental extension]ボタンを選択します。「The extensions on this site are experimental」と聞かれたら「I understand, continue」を選択します。

## 操作方法

1. 旗ボタンをクリックして「▷」ボタンをクリックします。「ルームキーを入力してください」と表示されたら適当なアルファベットを入力します。

2. 別のブラウザで開いたScratcXから同様にonlinegame.sbxとextension.jsを読み込んでルームキー先ほどと同じルームキーを入力します。ルームキーが一致するとゲーム開始です。

3. 最初にルームを作成したプレイヤーが`red`、後からルームに入室したプレイヤーが`yellow`となります。
  - redプレイヤーは左右キーで移動、下キーで弾を発射します。
  - yellowプレイヤーはadキーで移動、sキーで弾を発射します。

4. 先に20回当てた方が勝ちです。

## 画面イメージ


## 謝辞
本プロジェクトは以下の情報を参照または利用しています。大変参考になりました。

- [Socket.IO開発時に役立つツール4選とroom、namespaceライブラリの使い方 (@IT)](http://www.atmarkit.co.jp/ait/articles/1607/01/news027.html)
- [20170716OtOMOペアプロ作品 by yuki384](https://scratch.mit.edu/projects/168960218/)
