$(function() {
  // クッキーの名前
  var cookie_name = "mahjong_result";

  var player1_;
  var player2_;
  var player3_;
  var player4_;
  var uma32_;
  var uma41_;
  var mochi_;
  var kaeshi_;
  var toWhom_;
  var yakitori_;
  var chip_;

  var totalMochi_ = 100000;


  // 新規メモを末尾に追加
  var appendNewResult = function(result) {
    // 「%s」を、ttl と bdy の文字列に置換
    var template = "<tr><td>%d</td><td>%d</td><td>%d</td><td>%d</td></tr>"
    var html = template.replace("%d", result.player1).replace("%d", result.player2).replace("%d", result.player3).replace("%d", result.player4);
    console.log(html);
    // 末尾に追加
    $(".result").before(html);
  };


  // 追加処理
  var add = function() {
    var scoreObj = {
      player1: $("#player1Score").val() * 1,
      player2: $("#player2Score").val() * 1,
      player3: $("#player3Score").val() * 1,
      player4: $("#player4Score").val() * 1
    };

    var player1yakitori = $("#player1Yakitori").prop('checked');
    var player2yakitori = $("#player2Yakitori").prop('checked');
    var player3yakitori = $("#player3Yakitori").prop('checked');
    var player4yakitori = $("#player4Yakitori").prop('checked');

    console.log(scoreObj);
    var resultArr = [];
    for (var score in scoreObj)
      resultArr.push([score, scoreObj[score]]);
    resultArr.sort(function(a, b) {
      return b[1] - a[1];
    });

    // オカ
    resultArr[toWhom_ - 1][1] += (kaeshi_ - mochi_) * 4 ;

    var resultObj = {};
    for(var i = 0; i < resultArr.length; i++){
      resultArr[i][1] = (Math.round(resultArr[i][1] * 0.001) * 1000 - kaeshi_) * 0.001;

      // ウマ
      switch(i) {
        case 0: resultArr[i][1] += uma41_; break;
        case 1: resultArr[i][1] += uma32_; break;
        case 2: resultArr[i][1] -= uma32_; break;
        case 3: resultArr[i][1] -= uma41_; break;
      }
      resultObj[resultArr[i][0]] = resultArr[i][1];
    };

    console.log(resultObj);

    // // 新規メモを末尾に追加
    appendNewResult(resultObj);

    // // メモをクッキーに保存
    // saveMemo();
  };

  // リセット処理
  var reset = function() {
    if (!confirm('設定と結果が全て消えますがよろしいですか？')) {
      /* キャンセルの時の処理 */
      return false;
    } else {
      /*　OKの時の処理 */
      // 空にする
      $("#memoArea").empty();

      // クッキーを空に
      Cookies.remove(cookie_name);
      location.reload();
    }
  };

  var saveSetting = function() {
    // 設定の値を取得
    var player1 = encodeURI($("#player1").val());
    var player2 = encodeURI($("#player2").val());
    var player3 = encodeURI($("#player3").val());
    var player4 = encodeURI($("#player4").val());
    var uma32 = $("#uma32").val();
    var uma41 = $("#uma41").val();
    var mochi = $("#mochi").val();
    var kaeshi = $("#kaeshi").val();
    var toWhom = $("#toWhom").val();
    var yakitori = $("#yakitori").val();
    var chip = $("#chip").val();
    var player1Score = $("#player1Score").val();
    var player2Score = $("#player2Score").val();
    var player3Score = $("#player3Score").val();
    var player4Score = $("#player4Score").val();
    var player1yakitori = $("#player1Yakitori").prop('checked');
    var player2yakitori = $("#player2Yakitori").prop('checked');
    var player3yakitori = $("#player3Yakitori").prop('checked');
    var player4yakitori = $("#player4Yakitori").prop('checked');

    var settingObj = {
      player1: player1,
      player2: player2,
      player3: player3,
      player4: player4,
      uma32: uma32,
      uma41: uma41,
      mochi: mochi,
      kaeshi: kaeshi,
      toWhom: toWhom,
      yakitori: yakitori,
      chip: chip,
      player1Score: player1Score,
      player2Score: player2Score,
      player3Score: player3Score,
      player4Score: player4Score,
      player1yakitori: player1yakitori,
      player2yakitori: player2yakitori,
      player3yakitori: player3yakitori,
      player4yakitori: player4yakitori
    };

    // 保存用の名前と値
    var cookie_value = JSON.stringify(settingObj);

    // クッキーに保存
    Cookies.set(cookie_name, cookie_value);

    alert("保存されました");
    location.reload();
  }

  // アプリの復帰
  var restoreApp = function() {
    // クッキーの読み込み、空なら終了
    var cookie_value = Cookies.get(cookie_name);
    if (cookie_value === undefined) return;

    // クッキーの値をオブジェクトに変換、失敗時は終了
    try {
      var settingObj = JSON.parse(cookie_value);
    } catch (e) {
      console.log("[cookie read error] " + e);
      return;
    }

    player1_ = decodeURI(settingObj.player1);
    player2_ = decodeURI(settingObj.player2);
    player3_ = decodeURI(settingObj.player3);
    player4_ = decodeURI(settingObj.player4);
    uma32_ = settingObj.uma32 * 1;
    uma41_ = settingObj.uma41 * 1;
    mochi_ = settingObj.mochi * 1;
    kaeshi_ = settingObj.kaeshi * 1;
    toWhom_ = settingObj.toWhom * 1;
    yakitori_ = settingObj.yakitori * 1;
    chip_ = settingObj.chip * 1;

    player1Score = settingObj.player1Score
    player2Score = settingObj.player2Score
    player3Score = settingObj.player3Score
    player4Score = settingObj.player4Score
    player1yakitori = settingObj.player1yakitori
    player2yakitori = settingObj.player2yakitori
    player3yakitori = settingObj.player3yakitori
    player4yakitori = settingObj.player4yakitori

    totalMochi_ = mochi_ * 4;

    $('#player1').val(player1_);
    $('#player2').val(player2_);
    $('#player3').val(player3_);
    $('#player4').val(player4_);
    $('#uma32').val(uma32_);
    $('#uma41').val(uma41_);
    $('#mochi').val(mochi_);
    $('#kaeshi').val(kaeshi_);
    $('#toWhom').val(toWhom_);
    $('#yakitori').val(yakitori_);
    $('#chip').val(chip_);

    document.getElementsByClassName("player1Name")[0].innerText = player1_ ? player1_ : "名前";
    document.getElementsByClassName("player1Name")[1].innerText = player1_ ? player1_ : "名前";
    document.getElementsByClassName("player2Name")[0].innerText = player2_ ? player2_ : "名前";
    document.getElementsByClassName("player2Name")[1].innerText = player2_ ? player2_ : "名前";
    document.getElementsByClassName("player3Name")[0].innerText = player3_ ? player3_ : "名前";
    document.getElementsByClassName("player3Name")[1].innerText = player3_ ? player3_ : "名前";
    document.getElementsByClassName("player4Name")[0].innerText = player4_ ? player4_ : "名前";
    document.getElementsByClassName("player4Name")[1].innerText = player4_ ? player4_ : "名前";

    $("#player1Score").val(player1Score);
    $("#player2Score").val(player2Score);
    $("#player3Score").val(player3Score);
    $("#player4Score").val(player4Score);
    $("#player1Yakitori").prop('checked', player1yakitori);
    $("#player2Yakitori").prop('checked', player2yakitori);
    $("#player3Yakitori").prop('checked', player3yakitori);
    $("#player4Yakitori").prop('checked', player4yakitori);
  };



  // メモをクッキーに保存
  var saveMemo = function() {
    var memoArr = [];
    $("#memoArea .memo-group").each(function() {
      // タイトルと本文を取得
      var $this = $(this);
      var ttl = $this.find(".memo-title").val();
      var bdy = $this.find(".memo-body").val();

      // エンコード
      ttl = encodeURI(ttl);
      bdy = encodeURI(bdy);

      // オブジェクトを作成して配列に格納
      var obj = {
        ttl: ttl,
        bdy: bdy
      };
      memoArr.push(obj);
    });

    // 保存用の名前と値
    var cookie_value = JSON.stringify(memoArr);

    // クッキーに保存
    Cookies.set(cookie_name, cookie_value);
  };

  // アプリの復帰
  var restoreMemo = function() {
    // クッキーの読み込み、空なら終了
    var cookie_value = Cookies.get(cookie_name);
    if (cookie_value === undefined) return;

    // クッキーの値をオブジェクトに変換、失敗時は終了
    try {
      var memoArr = JSON.parse(cookie_value);
    } catch (e) {
      console.log("[cookie read error] " + e);
      return;
    }

    // メモの構築
    for (var i = 0; i < memoArr.length; i++) {
      // メモのタイトルと本文を取得、デコード
      var memo = memoArr[i];
      var ttl = memo.ttl;
      var bdy = memo.bdy;

      // デコード
      ttl = decodeURI(ttl);
      bdy = decodeURI(bdy);

      // 新規メモを末尾に追加
      appendNewMemo(ttl, bdy);
    }
  };

  var calcBalance = function() {
    var totalScore = 0;
    $(".playersScore").each(function() {
      totalScore += $(this).val() * 1;
    });
    balance_ = totalMochi_ - totalScore;
    // balance_ = $(".playersScore").val();
    // console.log($(this));
    document.getElementById("balance").innerText = "残り: " + balance_ + "点";
  }

  //設定の表示非表示
  $("#setting_show_button").click(function() {
    $("#setting").slideToggle();
    $("#setting_show_button").toggle();
    $("#setting_hide_button").toggle();
  });

  $("#setting_hide_button").click(function() {
    $("#setting").slideToggle();
    $("#setting_show_button").toggle();
    $("#setting_hide_button").toggle();
  });



  // ［追加］ボタンのイベントを登録
  $("#btnAdd").click(add);

  //設定保存ボタン
  $("#btnSaveSetting").click(saveSetting);

  // ［リセット］ボタンのイベントを登録
  $("#btnReset").click(reset);

  $(".playersScore").change(calcBalance);

  // メモの復帰
  restoreApp();
});
