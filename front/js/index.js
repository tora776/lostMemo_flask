/**
 * @type {HTMLFormElement}
 */

// 検索ボタン押下処理
document.getElementById("searchBtn").addEventListener('click', searchItem)

async function searchItem(ev){
    ev.preventDefault();
    // トークンと最終ログイン日時をチェックする
    checkToken();

    const sendDataJson = makeSendJson();

        try {
            // APIコール
            const response = await window.fetch("http://127.0.0.1:5000/SortItem", {
                method: "POST",
                // body: JSON.stringify(data, ["items", "places", "detailed_places"]),
                body: sendDataJson,
            });

            const json = await response.json();
            makeTable(json);

        } catch (e) {
            console.log(e);
        }
    };

// 追加ボタン押下処理
document.getElementById("insertBtn").addEventListener('click', insertItem)

async function insertItem(ev){
    ev.preventDefault();
    // トークンと最終ログイン日時をチェックする
    checkToken();
    // 追加するデータを作成する
    const sendDataJson = makeSendJson();

    try {
        // APIコール
        await window.fetch("http://127.0.0.1:5000/InsertItem", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: sendDataJson,
        });

        window.alert("送信しました。");

        // 完了時に入力値をクリア
        // form.reset();
        document.getElementById("item").value = "";
        document.getElementById("place").value = "";
        document.getElementById("detailed_place").value = "";
        // テーブル作成
        searchItem(ev);

    } catch (e) {
        console.log(e);
    }
};

// 削除ボタン押下処理
document.getElementById("deleteBtn").addEventListener('click', deleteItem)

async function deleteItem(ev){
    ev.preventDefault();
    // トークンと最終ログイン日時をチェックする
    checkToken();
    // チェックボックスの行を取得する
    checkedRows = getCheckedRows();

    try {
        // APIコール
        const response = await window.fetch("http://127.0.0.1:5000/DeleteItem", {
            method: "POST",
            body: JSON.stringify(checkedRows),
        });

        window.alert("送信しました。");

        const json = await response.json();
        searchItem(ev);

    } catch (e) {
        console.log(e);
    }
};


// 更新ボタン押下処理
document.getElementById("updateBtn").addEventListener('click', moveUpdatePage)

async function moveUpdatePage(ev){
  ev.preventDefault();
  // チェックボックスの値をセッションストレージに保存。
  const checkedRows = getCheckedRows();
  sessionStorage.setItem('checkedRows', checkedRows);
  // 現在のページのクエリパラメータを取得
  const params = new URLSearchParams(window.location.search);
  // パラメータを取得
  const user_id = params.get("user_id"); 
  const token = params.get("token");
  // update.htmlへ遷移
  window.location.href = 'update.html'　+ '?user_id=' + user_id + "&token=" + token;
};

async function checkToken(){
    // 現在のページのクエリパラメータを取得
    const params = new URLSearchParams(window.location.search);
    // パラメータを取得
    const user_id = params.get("user_id"); 
    const token = params.get("token");
    // JSONオブジェクト作成
    var obj = {
        "user_id": user_id,
        "token": token
    }
    const loginJSON = JSON.stringify(obj, null);

    try {
        // APIコール
        const response = await window.fetch("http://127.0.0.1:5000/lastLoginCheck", {
            method: "POST",
            body: loginJSON,
        });

        // 処理結果を受け取る
        const result = await response.json();

        // bool値を取得
        const isValid = result.result;
        console.log("Result:", isValid);
        
        
        // 必要に応じて処理
        if (isValid == false) {
            alert("トークンの期限が切れています。再ログインしてください");
            window.location.href = 'login.html';
        }
        

    } catch (e) {
        console.log(e);
    }

};

function makeSendJson(){
    // 現在のページのクエリパラメータを取得
    const params = new URLSearchParams(window.location.search);
    // パラメータを取得
    const user_id = params.get("user_id"); 
    const item = document.getElementById("item").value;
    const place = document.getElementById("place").value;
    const detailed_place = document.getElementById("detailed_place").value;

    // JSONオブジェクト作成
    var obj = {
        "user_id": user_id,
        "items": item,
        "places": place,
        "detailed_places": detailed_place
    }
    const sendDataJson = JSON.stringify(obj, null);

    return sendDataJson;
}
