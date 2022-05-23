/*
 * main.js : ターミナルを再現
 */
let terminal = null; // ターミナル画面をtextareaタグで再現
let screenWidth, screenHeight; // ターミナルの幅と高さ（ブラウザの幅と高さ取得用）
let operater = "YUKI.N>"; // コマンド入力時のプロンプト文字
let value = ""; // ターミナル画面上の文字列取得用
let command = ""; // 入力されたコマンド文字列取得用
const COMMANDS = [ "cls", "clear" ];
const YUKI_N = ["みえてる？", "そっちの時空間とは\nまだ完全には連結を絶たれていない。\nでも時間の問題。\nそうなれば最後。","どうにもならない。\n情報統合思念体は失望している。\nこれで進化の可能性は失われた。\nx", "涼宮ハルヒは\n何もない所から\n情報を生み出す力を\n持っていた。\nそれは情報統合思念体にも\nない力。\nこの情報創造能力を解析すれば\n自律進化への糸口が\nつかめるかもしれないと考えた。\nx", "あなたに賭ける。", "もう一度こちらへ回帰することを\n我々は望んでいる。\n涼宮ハルヒは重要な観察対象。\nわたしという個体も\nあなたには戻ってきて欲しいと感じている。\nx", "また図書館に\nx", " sleeping beautyF"];
const KYON = ["ああ", "どうすりゃいい？","", "", "何をだよ"];

let tanabata = false; // 七夕かどうか？
let audio = null;
let bgm77 = "00043_gymnopedies.mp3"; // 7月7日に流れる曲

let message_yuki;
let commandIndex;
let index, lastIndex;
let timer;

const Y = 0;
const K = 1;
const F = -1;

let mode;

let color = {"red": 0, "green": 0, "blue": 0};
/*
 * ターミナルのサイズをブラウザ画面いっぱいに設定する関数
 */
function setTerminal(){
// ブラウザのウインドウサイズを取得
let innerWidth =  window.innerWidth;
let innerHeight = window.innerHeight;
// textareaのサイズをウインドウにフィットさせる
terminal.style.innerWidth  = innerWidth + "px";
terminal.style.innerHeight = innerHeight + "px";
}

/*
 * ターミナル上で最後に入力された文字列をコマンド文字列として取得する関数
 */
function getCommand(value){
// 最後のコマンド部分のインデックスを取得
let index = value.lastIndexOf(operater);
// オペレータ部分の文字列は必要ないのでインデックスに加算
let lastIndex = index + operater.length;
console.log("位置: " + lastIndex);
// 最後に入力した文字列をコマンド文字列として取得する
let commandString = value.slice(lastIndex); // 文字列切り出し
commandString = commandString.replace(/\n| /g, ""); // 改行と半角スペースを消去
let work = YUKI_N[commandIndex].replace(/\n/g, "");
commandString = commandString.replace(work, "");
console.log("replace後: " + commandString);
return commandString;
}

/*
 * コマンド実行関数
 */
function execCommand(){
let message = "";
// 指定されたコマンド内に入力されたコマンド文字列が存在するかチェック（見つかった場合はcount=1）
let count = 0;
for(let i in COMMANDS){
if(command == COMMANDS[i]) count++;
}
if(command == KYON[commandIndex]){
if(KYON[commandIndex] === "何をだよ"){
terminal.value = "\n";
}
commandIndex++;
message_yuki = "\n" + operater + YUKI_N[commandIndex] + "\n";
console.log(message_yuki);

// 1文字ずつメッセージを表示
index = 0;
lastIndex = message_yuki.length;
console.log(index + ":" + lastIndex);
mode = Y;
inputTerminal();
return;
}

// コマンドが見つからない（エラーメッセージ設定）
if(count != 1){
message = ">>> Command '" + command + "' not found.\n";
}
// 各コマンドによる処理
if(command == "cls" || command == "clear"){
value = "";
}
// コマンド実行終了後のターミナル文字列設定
value += message;
}

/*
 * メッセージから1文字取り出す
 */
function popMessage(){
let message_char = message_yuki.slice(index, index+1);
console.log(message_char);
if(message_char === "x"){
mode = Y;
return "NEXT";
}
else if(message_char === "F"){
mode = F;
return "FINAL";
}
else if(index > lastIndex){
mode = K;
return "EOD";
}

index++;
return message_char;
}

/*
 * Y
 */
function inputTerminal(){
let message_char = popMessage();

if(message_char === "EOD"){
mode = K;
clearTimeout(timer);
return;
}
else if(message_char === "NEXT"){
clearTimeout(timer);
mode = Y;
commandIndex ++;
message_yuki = "\n" + operater + YUKI_N[commandIndex] + "\n";
console.log(message_yuki);

// 1文字ずつメッセージを表示
index = 0;
lastIndex = message_yuki.length;
console.log(index + ":" + lastIndex);
inputTerminal();
return;
}
else if(message_char === "FINAL"){
clearTimeout(timer);
whiteOut();
return;
}
terminal.value += message_char;
let interval = Math.floor(Math.random() * 300) + 1;
timer = setTimeout(inputTerminal, interval);
}

/*
 * だんだん白くなる
 */
function whiteOut(){
// rgb値を一律に減らしていく（黒->白）
color.red ++; color.green++; color.blue++;

// rgb値が「255」で終了
if(color.red > 255){
console.log("Finished!");
// 現在日時を取得
let today = new Date();

// 月日を取得
let month = today.getMonth() + 1; // 1月~12月 -> 0~11
let date = today.getDate();
if(month == 7 && date == 7){ // 七夕ならメッセージ
tanabata = true;
terminal.style.backgroundColor = "black";
terminal.value = "\n\n\n\n\n\n" + operater + "SOS団七夕会議... Press Enter..."
}
return;
}

// 背景色を変更
terminal.style.backgroundColor = "rgb(" + color.red + "," + color.green + "," + color.blue + ")";
// 30ミリ秒後に再帰
setTimeout(whiteOut, 50);
}

/*
 * 起動時の処理
 */
window.addEventListener("load", function(){
//
mode = Y;
commandIndex = 0;

// Audio要素の設定
audio = new Audio();
audio.src = bgm77; // 再生ファイル名設定
audio.preload = "auto"; // データを自動取得

// textareaのDOM取得
terminal = document.getElementById("terminal");

// ターミナルのサイズをブラウザ画面いっぱいに設定
setTerminal();

// ターミナルの初期状態（textareaタグの文字列にプロンプトを表示）
//terminal.value = "\n" + operater + " ";
message_yuki = "\n" + operater + YUKI_N[commandIndex] + "\n";
console.log(message_yuki);

// 1文字ずつメッセージを表示
index = 0;
lastIndex = message_yuki.length;
console.log(index + ":" + lastIndex);
inputTerminal();
// ターミナル（textareaタグ）にフォーカス ==>カーソルが点滅する
terminal.focus();
});

/*
 * ブラウザ画面をリサイズした際に再度ターミナルのサイズをブラウザ画面いっぱいにする関数
 */
window.addEventListener("resize", function(){
setTerminal();
});

/*
 * ターミナル上（textareaタグ）でキー入力した際のイベント処理
 */
window.addEventListener("keyup", function(e){
// キー番号を取得
let key = e.keyCode;
// Enterキーが押されたとき
if(key == 13){
if(tanabata){ // 七夕の日は曲を流す
audio.play();
}
value = terminal.value; // textareaの文字列を取得
if(value.match(/\n$/) == null){ // 漢字変換でEnterキーを押した場合
return; // 取得した文字の最後が改行文字ではないので何もしない
}

// 取得した文字列の中からコマンドを取得
command = getCommand(value);
console.log("取得コマンド[" + command + "]");

// コマンド実行（文字列が空以外なら実行）
if(command !== "") execCommand();
// 新しいプロンプトを追加表示
if(mode != Y){
terminal.value = value + operater + " ";
}

// フォーカスを常にtextareaにしておく
terminal.focus();
}
});
