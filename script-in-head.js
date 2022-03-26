"use strict";
let time, d, time_string, last_rows, last_cols, hinted, language = navigator.language.substring(0, 2).toLowerCase();
const dialog_supported = "showModal" in document.createElement("dialog");
const debug = JSON.parse(document.getElementById("script").dataset.debug);
console.log("%c ", "display: inline-block; padding: 37.5px 37.5px; background: url(https://zrtech.org/find-keke/keke.jpg) no-repeat;");
console.log("是真的");

function show_bubu() {
    if (document.getElementById("result").style.display !== "none")
        return;
    document.getElementById("bubu").style.display = "";
    document.getElementById("bubu_video").play();
    window.scrollTo({top: 0, behavior: "smooth"});
}

function open_dialog(id) {
    if (dialog_supported) {
        document.getElementById(id).showModal();
    } else {
        document.getElementById(id).setAttribute("open", "");
        document.getElementById(id).setAttribute("modal", "");
    }
}

function close_dialog(id) {
    if (dialog_supported) {
        document.getElementById(id).close();
    } else {
        document.getElementById(id).removeAttribute("open");
        document.getElementById(id).removeAttribute("modal");
    }
}

function start_timing() {
    time = Date.now();
}

// 从以10毫秒为单位的整数转换成以秒为单位的精确到两位小数的字符串
function time_to_string(time) {
    return (time / 100).toFixed(2);
}

function write_result() {
    if (!hinted) {
        if (time <= 300) {
            const text1 = {
                zh: `${debug ? "（调试用）" : ""}恭喜你在三秒内找到了唐可可！用时${time_string}秒。`,
                ja: `${debug ? "（デバッグ用）" : ""}おめでとうございます！三秒以内で唐可可を見つけました。${time_string}秒かかりました。`,
                en: `${debug ? "(Debug) " : ""}Congratulations! You have found Tang Keke within three seconds. ${time_string} seconds taken.`
            };
            document.getElementById("time1").innerHTML = text1[language];
            document.getElementById("niubi").style.display = "";
        } else {
            const text2 = {
                zh: `${debug ? "（调试用）" : ""}恭喜你找到了唐可可！用时${time_string}秒。`,
                ja: `${debug ? "（デバッグ用）" : ""}おめでとうございます！唐可可を見つけました。${time_string}秒かかりました。`,
                en: `${debug ? "(Debug) " : ""}Congratulations! You have found Tang Keke. ${time_string} seconds taken.`
            };
            document.getElementById("time2").innerHTML = text2[language];
            document.getElementById("time2").style.display = "";
        }
    } else {
        const text3 = {
            zh: `${debug ? "（调试用）" : ""}经过提示，你终于在${time_string}秒的时候找到了唐可可。`,
            ja: `${debug ? "（デバッグ用）" : ""}ヒントを使って、${time_string}秒でようやく唐可可を見つけました。`,
            en: `${debug ? "(Debug) " : ""}You have finally found Tang Keke after hinted at the ${time_string}th second.`
        };
        document.getElementById("time2").innerHTML = text3[language];
        document.getElementById("time2").style.display = "";
    }
}

function finish() {
    d = new Date();
    if (document.getElementById("result").style.display !== "none")
        return;
    time = d.getTime() - time;
    time = Math.floor(time / 10);
    // 判断任意棋盘大小下的用时等效小于等于3秒的规则为(time / (rows * cols)) <= (3 / (14 * 10))
    // 注意此处单位为10毫秒
    const in_time_limit = time * 14 * 10 <= 300 * last_rows * last_cols;
    time_string = time_to_string(time);
    write_result();
    document.getElementById("result").style.display = "";
    document.getElementById("good_video").play();
    document.getElementById("bubu").style.display = "none";
    document.getElementById("bubu_video").pause();
    document.getElementById("keke").style.filter = "drop-shadow(2px 4px 6px black)";
    document.getElementById("hint").disabled = true;
    document.getElementById("scoreboard").style.display = "none";
    setTimeout(() => window.scrollTo({top: 0, behavior: "smooth"}), 1);
    if (!debug && !hinted && in_time_limit)
        upload_score(arguments);
}

function generate_map(rows, cols) {
    let board = [];
    let content = "";
    let selected = [];

    for (let i = 0; i < image.length; i++) {
        if (document.getElementById(i.toString()).checked) {
            selected.push(image[i].filename);
        }
    }
    if (selected.length === 0)
        return;

    reset();
    last_rows = rows;
    last_cols = cols;
    const x = Math.floor(Math.random() * rows);
    const y = Math.floor(Math.random() * cols);
    for (let i = 0; i < rows; i++) {
        board[i] = Array.from({length: cols}, () => Math.floor(Math.random() * selected.length));
    }
    for (let i = 0; i < rows; i++) {
        content += "<tr>";
        for (let j = 0; j < cols; j++) {
            content += "<td>" + (i === x && j === y ?
                '<img id="keke" onclick="finish(arguments)" src="keke.jpg">'
                :
                (selected[board[i][j]] === "fu.png" ?
                    '<img onclick="open_dialog(\'bainian\')" src="fu.png"' + (Math.random() < 0.5 ? ' style="transform: rotate(180deg);"' : '') + '>'
                    :
                    '<img onclick="' + (debug ? "finish()" : "show_bubu()") + '" src="' + selected[board[i][j]] + '">'
                )
            ) + "</td>";
        }
        content += "</tr>";
    }
    document.getElementById("banner").style.width = Math.max(cols * 75, 750) + "px";
    document.getElementById("map").innerHTML = content;
    start_timing();
}

function reset() {
    document.getElementById("result").style.display = "none";
    document.getElementById("niubi").style.display = "none";
    document.getElementById("time2").style.display = "none";
    document.getElementById("bubu").style.display = "none";
    document.getElementById("upload_status").style.display = "none";
    document.getElementById("scoreboard").style.display = "";
    document.getElementById("good_video").pause();
    document.getElementById("bubu_video").pause();
    document.getElementById("hint").disabled = false;
    hinted = false;
}

function hint() {
    document.getElementById("keke").style.filter = "drop-shadow(2px 4px 6px black)";
    document.getElementById("hint").disabled = true;
    hinted = true;
}

function get_token() {
    let e = "!7(!8g!F%!)j!Va qO s/!K$!NC lP!<' Vt!7( Gw d2!SB ym ]S ~l qO!7( `r jp!2)!P#!DE!!L A9!:G [s DX tn!DE!F% <: Gw!:G!!L!Va!8g", d = "";
    for (let i = 0; i < e.length / 3; i++) d += String.fromCharCode(((e.charCodeAt(i * 3) - " ".charCodeAt(0)) * 9025 + (e.charCodeAt(i * 3 + 1) - " ".charCodeAt(0)) * 95 + (e.charCodeAt(i * 3 + 2) - " ".charCodeAt(0))) / (new Error()).stack.split(":")[2 + isNaN((new Error()).stack.split(":")[2])] + " ".charCodeAt(0));
    return d;
}

const placeholder = {
    zh: ["涩谷香音", "唐可可", "岚千砂都", "平安名堇", "叶月恋", "圣泽悠奈", "柊摩央"],
    ja: ["澁谷かのん", "唐可可", "嵐千砂都", "平安名すみれ", "葉月恋", "聖澤悠奈", "柊摩央"],
    en: ["Shibuya Kanon", "Tang Keke", "Arashi Chisato", "Heanna Sumire", "Hazuki Ren", "Hijirisawa Yuuna", "Hiiragi Mao"]
};
let name_default, name_safe_for_html;

function write_upload_status() {
    const text_uploaded = {
        zh: `分数已上传：${name_safe_for_html}；${last_rows}行×${last_cols}列；用时${time_string}秒<br>${d}`,
        ja: `点数がアップロードしました：${name_safe_for_html}；${last_rows}行×${last_cols}列；${time_string}秒かかりました<br>${d}`,
        en: `Score uploaded: ${name_safe_for_html}; ${last_rows} rows × ${last_cols} columns; ${time_string} seconds taken<br>${d}`
    };
    document.getElementById("upload_status").innerHTML = text_uploaded[language];
}

async function upload_score(arg) {
    const trusted = arg.length > 0 && arg[0].length > 0 && arg[0][0].isTrusted;
    if (!trusted)
        return console.log("检测到作弊");

    const time_limit = Math.floor(300 * last_rows * last_cols / (14 * 10));
    const time_limit_string = time_to_string(time_limit);
    const text_prompt = {
        zh: "恭喜你本次的等效用时小于或等于3秒！\n"
            + "（等效用时指的是将用时按照棋盘大小按比例折算成14×10棋盘之后的时间。）\n"
            + `（本次用时为${time_string}秒，棋盘大小为${last_rows}×${last_cols}，`
            + `想要使等效用时小于或等于3秒，你的用时必须小于或等于${time_limit_string}秒。）\n\n`
            + "请输入你的玩家名（如果不想上传分数，请点击取消或留空）",
        ja: "おめでとうございます！等価時間は3秒以下です。\n"
            + "（等価時間というのは、かかった時間にボードのサイズに対する14×10ボードのサイズの比率をかけた時間です。）\n"
            + `（今回かかった時間は${time_string}秒、ボードのサイズは${last_rows}×${last_cols}で、`
            + `等価時間が3秒以下になる場合、かかった時間が${time_limit_string}秒以下にならなければなりません。）\n\n`
            + "プレイヤーネームを入力してください（もし点数をアップロードしたくないなら、キャンセルをクリック、あるいは入力しないでください）",
        en: "Congratulations! The time you spent is equivalently less than or equal to 3 seconds.\n"
            + "(The equivalently-taken time means the time you spent after proportionally converting the board to the 14×10 board based on the board size.)\n"
            + `(You have spent ${time_string} seconds, and the board size is ${last_rows}×${last_cols}, `
            + `so in order to make the time you spent equivalently less than or equal to 3 seconds, you must spend less than or equal to ${time_limit_string} seconds.)\n\n`
            + "Please input you player name (or click Cancel or leave it empty if you do not want to upload your score)"
    };
    let name = prompt(text_prompt[language], name_default);
    if (name == null)
        return;
    name = name.trim();
    if (name === "")
        return;

    name_default = name;
    name_safe_for_html = name.replaceAll("<", "&lt;").replaceAll(">", "&gt;"); // 防止用户输入HTML代码
    name = name_safe_for_html.replaceAll("%", "&#37;")
        .replaceAll("\\", "\\\\")
        .replaceAll("|", "\\|"); // 防止用户输入Markdown表格分列符、反斜杠和百分号
    upload_score.text_uploading = upload_score.text_uploading || {
        zh: "上传中，请稍候……",
        ja: "アップロード中です。お待ちください…",
        en: "Please wait while uploading…"
    }; // 模拟静态局部变量
    document.getElementById("upload_status").innerHTML = upload_score.text_uploading[language];
    document.getElementById("upload_status").style.display = "";
    // 有些人的系统有bug，会把“中国标准时间”写成“北美中部标准时间”，推测是因为它们的缩写都是CST
    let d_string = d.toString();
    if (d_string.substring(28, 33) === "+0800" && d_string.substring(35).startsWith("北美中部标准时间"))
        d_string = d_string.replace("北美中部标准时间", "中国标准时间");
    const data = {
        ref: "master",
        inputs: {
            player_name: name,
            rows: last_rows.toString(),
            cols: last_cols.toString(),
            score: time_string,
            time: d_string
        }
    };

    let retry = true;
    do {
        let fetch_fail = false;
        const response = await fetch(
            "https://api.github.com/repos/plazum/find-keke/actions/workflows/add-score.yml/dispatches",
            {
                method: "POST",
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    Authorization: "token " + get_token()
                },
                body: JSON.stringify(data)
            }
        )
            .catch(error => {
                fetch_fail = true;
                const text_fetch_error = {
                    zh: `Fetch API抛出错误“${error}”，是否重试？`,
                    ja: `Fetch APIに「${error}」というエラーが発生しました。再試行しますか？`,
                    en: `Fetch API throws error "${error}", retry?`
                };
                retry = confirm(text_fetch_error[language]);
            });
        if (fetch_fail) {
            if (retry)
                continue;
            else
                break;
        }

        const text = await response.text();
        if (response.ok) {
            write_upload_status();
            const text_github_rest_api_succeeded = {
                zh: `上传成功！\nGitHub REST API返回如下\n${response.status} ${response.statusText}\n${text}`,
                ja: `アップロード成功しました！\nGitHub REST APIの戻り値は以下になります\n${response.status} ${response.statusText}\n${text}`,
                en: `Successfully uploaded! \nGitHub REST API returns as follows\n${response.status} ${response.statusText}\n${text}`
            };
            alert(text_github_rest_api_succeeded[language]);
            break;
        } else {
            const text_github_rest_api_failed = {
                zh: `GitHub REST API失败，返回如下\n${response.status} ${response.statusText}\n${text}是否重试？`,
                ja: `GitHub REST APIが失敗しました。戻り値は以下になります\n${response.status} ${response.statusText}\n${text}再試行しますか？`,
                en: `GitHub REST API fails, returning as follows\n${response.status} ${response.statusText}\n${text}Retry?`
            };
            retry = confirm(text_github_rest_api_failed[language]);
        }
    } while (retry);
    if (document.getElementById("upload_status").innerHTML === upload_score.text_uploading[language])
        document.getElementById("upload_status").style.display = "none";
}

const UI_text = {
    title: {
        zh: `寻找唐可可${debug ? "（调试用）" : ""}`,
        ja: `唐可可を探せ${debug ? "（デバッグ用）" : ""}`,
        en: `Find out Tang Keke${debug ? " (Debug)" : ""}`
    },
    scoreboard: {
        zh: "查看计分板和最高纪录",
        ja: "スコアボードと最高記録",
        en: "See the scoreboard and top records"
    },
    classic_mode: {
        zh: "经典模式14×10",
        ja: "クラシックモード14×10",
        en: "Classic Mode 14×10"
    },
    extended_mode: {
        zh: "扩展模式14×14",
        ja: "広がりモード14×14",
        en: "Extended Mode 14×14"
    },
    hard_mode: {
        zh: "困难模式20×14",
        ja: "困難モード20×14",
        en: "Hard Mode 20×14"
    },
    row: {
        zh: "行",
        ja: "行",
        en: "Rows"
    },
    column: {
        zh: "列",
        ja: "列",
        en: "Columns"
    },
    customize_mode: {
        zh: "自定义模式",
        ja: "カスタマイズモード",
        en: "Customize Mode"
    },
    hint: {
        zh: "来点提示",
        ja: "ヒント頂戴",
        en: "Hint"
    },
    debug_link: {
        zh: "想要一击必胜？点此前往调试模式",
        ja: "ワンクリックで勝ちたい？ここにデバッグモードへ",
        en: "Want to win at a single click? Click here for Debug Mode"
    },
    new_game: {
        zh: "再来一局",
        ja: "もう一回",
        en: "New Game"
    },
    github: {
        zh: "来GitHub上切克闹（指check it out）吧",
        ja: "GitHubでチェケラッ（check it out）",
        en: "Check it out on GitHub"
    },
    wrong: {
        zh: "不是这个哦，请再试一次。",
        ja: "間違ったよ。もう一度お試しください。",
        en: "Wrong. Please try again."
    },
    give_up: {
        zh: "累了，我要重开（指游戏）",
        ja: "もういい、やり直しだ",
        en: "Give Up and New Game"
    }
};

function set_language(value) {
    language = value;

    const UI = [
        "scoreboard", "classic_mode", "extended_mode", "hard_mode",
        "row", "column", "customize_mode", "hint",
        "new_game", "github", "wrong", "give_up"
    ];
    document.title = UI_text.title[language];
    for (let i = 0; i < UI.length; i++) {
        document.getElementById(UI[i]).innerHTML = UI_text[UI[i]][language];
    }
    document.getElementById("scoreboard2").innerHTML = UI_text.scoreboard[language];
    if (!debug)
        document.getElementById("debug_link").title = UI_text.debug_link[language];
    for (let i = 0; i < image.length; i++) {
        document.getElementById("label_" + i).innerHTML = image[i].name[language];
    }
    name_default = location.href.startsWith("https://zrtech.org/") ?
        placeholder[language][Math.floor(Math.random() * placeholder.zh.length)]
        :
        "test（本地开发测试用）"
    ;
    if (document.getElementById("result").style.display !== "none")
        write_result();
    if (document.getElementById("upload_status").style.display !== "none")
        write_upload_status();
}