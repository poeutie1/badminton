// src/app/how-to-use/page.tsx
export default function HowToUsePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">利用方法</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">練習会への参加方法</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>練習日程から参加したい日をクリック</li>
          <li>詳細を確認して「参加表明」をクリック</li>
          <li>ニックネームを入力して確定</li>
          <li>人数オーバーならキャンセル待ちに登録</li>
          <li>
            キャンセル待ちは枠に空きが出た際に、自動的に登録順（早い順）で繰り上がる
          </li>
          <small className="block mt-1 text-gray-600">
            ※参加表明をキャンセルする場合は、参加表明時と同様のニックネームを記入すると表示される参加キャンセルボタンを押す
          </small>
          <small className="block mt-1 text-red-600">
            ※参加表明時のニックネームは既に参加者欄にある名前以外を使用してください
          </small>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">管理者の方へ</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>管理画面にログイン</li>
          <li>日程と定員を入力して「作成」</li>
          <li>一覧に新しい練習会が追加される</li>
        </ol>
      </section>
    </div>
  );
}
