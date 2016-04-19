$(function() {
  // クッキーの名前
  var cookie_name = "mahjong_result";

  var resultArr_ = [];

  //初期化
  var player1_ = "";
  var player2_ = "";
  var player3_ = "";
  var player4_ = "";
  var uma32_ = 10;
  var uma41_ = 20;
  var mochi_ = 25000;
  var kaeshi_ = 30000;
  var toWhom_ = 1;
  var yakitori_ = 5;
  var buttobi_ = 10;
  var ratio_ = 1;
  // var chip_ = 500;

  var balance_ = 100000;
  var totalMochi_ = 100000;

  var gameCount_ = 1;
  // 新規結果を表の末尾に追加
  var appendNewResult = function(result) {
    // 「%s」を、ttl と bdy の文字列に置換
    var template = "<tr><td>%d</td><td>%d</td><td>%d</td><td>%d</td><td>%d</td></tr>"
    var html = template.replace("%d", gameCount_++ + "戦目").replace("%d", result.player1).replace("%d", result.player2).replace("%d", result.player3).replace("%d", result.player4);
    // 末尾に追加
    $(".totalResult").before(html);
    updateTotalResult();
  }

  // 新規結果を表の末尾に追加
  var updateTotalResult = function() {
    var totalResultArr = calcTotalResult();
    // 「%s」を、ttl と bdy の文字列に置換
    var template = "<td>合計点</td><td>%d</td><td>%d</td><td>%d</td><td>%d</td>"
    var html = template.replace("%d", totalResultArr[0])
                       .replace("%d", totalResultArr[1])
                       .replace("%d", totalResultArr[2])
                       .replace("%d", totalResultArr[3]);
    $(".totalResult").empty();
    $(".totalResult").append(html);
    var template = "<td>￥精算</td><td>%d</td><td>%d</td><td>%d</td><td>%d</td>"
    var html = template.replace("%d", totalResultArr[0] * ratio_ * 100)
                       .replace("%d", totalResultArr[1] * ratio_ * 100)
                       .replace("%d", totalResultArr[2] * ratio_ * 100)
                       .replace("%d", totalResultArr[3] * ratio_ * 100);
    $(".totalAmount").empty();
    $(".totalAmount").append(html);
  }

  var updateTotalAmount = function() {
    var template = "<td>￥精算</td><td>%d</td><td>%d</td><td>%d</td><td>%d</td>"

  }


  // 追加処理
  var add = function() {

    if (balance_ != 0 && !confirm('点数が正しく入力されていません。\nよろしいですか？')) {
      /* キャンセルの時の処理 */
      return false;
    }

    var scoreObj = {
      player1: $("#player1Score").val() * 1,
      player2: $("#player2Score").val() * 1,
      player3: $("#player3Score").val() * 1,
      player4: $("#player4Score").val() * 1
    };

    //　焼き鳥
    var yakitoriCount = 0;
    var yakitoriArr = [];
    for (var i = 1; i <= 4; i++) {
      if ($("#player" + i + "Yakitori").prop('checked')) {
        yakitoriCount++;
        yakitoriArr.push(i);
      }
    }

    // ぶっ飛び
    var tobiPlayerArr = [];
    for (var i = 1; i <= 4; i++) {
      if ($("#player" + i + "Tobi").prop('checked')) {
        tobiPlayerArr.push(i);
      }
    }

    var tobashiPlayer = "";
    // ぶっ飛ばし
    for (var i = 1; i <= 4; i++) {
      if ($("#player" + i + "Tobashi").prop('checked')) {
        tobashiPlayer = "player" + i;
        break;
      }
    }

    var resultArr = [];
    for (var score in scoreObj)
      resultArr.push([score, scoreObj[score]]);
    resultArr.sort(function(a, b) {
      return b[1] - a[1];
    });

    // オカ
    resultArr[toWhom_ - 1][1] += (kaeshi_ - mochi_) * 4;

    var resultObj = {};
    var totalPoint = 0;
    for (var i = 0; i < resultArr.length; i++) {
      if (resultArr[i][1] >= kaeshi_){
        resultArr[i][1] = (Math.floor(resultArr[i][1] * 0.001) * 1000 - kaeshi_) * 0.001;
      } else {
        resultArr[i][1] = (Math.ceil(resultArr[i][1] * 0.001) * 1000 - kaeshi_) * 0.001;
      }


      // ウマ
      switch (i) {
        case 0:
          resultArr[i][1] += uma41_;
          break;
        case 1:
          resultArr[i][1] += uma32_;
          break;
        case 2:
          resultArr[i][1] -= uma32_;
          break;
        case 3:
          resultArr[i][1] -= uma41_;
          break;
      }

      if (i > 0 && i <= 3) {
        totalPoint += resultArr[i][1];
      }

      if (i == 3) {
        resultObj[resultArr[i][0]] = resultArr[i][1];
        resultObj[resultArr[0][0]] = totalPoint * -1;
      } else {
        resultObj[resultArr[i][0]] = resultArr[i][1];
      }

    }
    if (yakitoriCount > 0) {
      for (var i = 1; i <= 4; i++) {
        if ($.inArray(i, yakitoriArr) >= 0) {
          resultObj["player" + (i)] -= yakitori_ * (4 - yakitoriCount);
        } else {
          resultObj["player" + (i)] += yakitori_ * yakitoriCount;
          // console.log($.inArray(i, yakitoriArr));
        }
      }
    }

    if (tobiPlayerArr.length > 0 && tobashiPlayer != "") {
      tobiPlayerArr.forEach(function(v) {
        // console.log(buttobi_);
        resultObj["player" + v] -= buttobi_;
        resultObj[tobashiPlayer] += buttobi_;
      });
    }



    // console.log(resultObj);

    resultArr_.push(resultObj);

    // 新規結果を表の末尾に追加
    appendNewResult(resultObj);

    saveResult();
  }

  var deleteRow = function() {
    if (!confirm('最新の結果を１つ削除します。')) {
      /* キャンセルの時の処理 */
      return false;
    }
    resultArr_.pop();
    gameCount_--;
    saveResult();
    location.reload();
  }

  var deleteAll = function() {
    if (!confirm('結果が全て削除されますがよろしいですか？')) {
      /* キャンセルの時の処理 */
      return false;
    }
    resultArr_ = [];
    gameCount_ = 1;
    saveResult();
    location.reload();
  }

  // リセット処理
  var reset = function() {
    if (!confirm('設定と結果が全て消えますがよろしいですか？')) {
      /* キャンセルの時の処理 */
      return false;
    } else {
      /*　OKの時の処理 */
      // クッキーを空に
      Cookies.remove(cookie_name);
      location.reload();
    }
  }

  var saveResult = function() {
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
    var buttobi = $("#buttobi").val();
    var ratio = $("#ratio").val();
    // var chip = $("#chip").val();
    var player1Score = $("#player1Score").val();
    var player2Score = $("#player2Score").val();
    var player3Score = $("#player3Score").val();
    var player4Score = $("#player4Score").val();
    var player1yakitori = $("#player1Yakitori").prop('checked');
    var player2yakitori = $("#player2Yakitori").prop('checked');
    var player3yakitori = $("#player3Yakitori").prop('checked');
    var player4yakitori = $("#player4Yakitori").prop('checked');
    var player1Tobi = $("#player1Tobi").prop('checked');
    var player2Tobi = $("#player2Tobi").prop('checked');
    var player3Tobi = $("#player3Tobi").prop('checked');
    var player4Tobi = $("#player4Tobi").prop('checked');
    var player1Tobashi = $("#player1Tobashi").prop('checked');
    var player2Tobashi = $("#player2Tobashi").prop('checked');
    var player3Tobashi = $("#player3Tobashi").prop('checked');
    var player4Tobashi = $("#player4Tobashi").prop('checked');

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
      buttobi: buttobi,
      // chip: chip,
      ratio: ratio,
      player1Score: player1Score,
      player2Score: player2Score,
      player3Score: player3Score,
      player4Score: player4Score,
      player1yakitori: player1yakitori,
      player2yakitori: player2yakitori,
      player3yakitori: player3yakitori,
      player4yakitori: player4yakitori,
      player1Tobi: player1Tobi,
      player2Tobi: player2Tobi,
      player3Tobi: player3Tobi,
      player4Tobi: player4Tobi,
      player1Tobashi: player1Tobashi,
      player2Tobashi: player2Tobashi,
      player3Tobashi: player3Tobashi,
      player4Tobashi: player4Tobashi,
      resultArr: resultArr_
    }

    // 保存用の名前と値
    var cookie_value = JSON.stringify(settingObj);

    // クッキーに保存
    Cookies.set(cookie_name, cookie_value);
  }

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
    var buttobi = $("#buttobi").val();
    var ratio = $("#ratio").val();
    // var chip = $("#chip").val();
    var player1Score = $("#player1Score").val();
    var player2Score = $("#player2Score").val();
    var player3Score = $("#player3Score").val();
    var player4Score = $("#player4Score").val();
    var player1yakitori = $("#player1Yakitori").prop('checked');
    var player2yakitori = $("#player2Yakitori").prop('checked');
    var player3yakitori = $("#player3Yakitori").prop('checked');
    var player4yakitori = $("#player4Yakitori").prop('checked');
    var player1Tobi = $("#player1Tobi").prop('checked');
    var player2Tobi = $("#player2Tobi").prop('checked');
    var player3Tobi = $("#player3Tobi").prop('checked');
    var player4Tobi = $("#player4Tobi").prop('checked');
    var player1Tobashi = $("#player1Tobashi").prop('checked');
    var player2Tobashi = $("#player2Tobashi").prop('checked');
    var player3Tobashi = $("#player3Tobashi").prop('checked');
    var player4Tobashi = $("#player4Tobashi").prop('checked');

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
      buttobi: buttobi,
      // chip: chip,
      ratio: ratio,
      player1Score: player1Score,
      player2Score: player2Score,
      player3Score: player3Score,
      player4Score: player4Score,
      player1yakitori: player1yakitori,
      player2yakitori: player2yakitori,
      player3yakitori: player3yakitori,
      player4yakitori: player4yakitori,
      player1Tobi: player1Tobi,
      player2Tobi: player2Tobi,
      player3Tobi: player3Tobi,
      player4Tobi: player4Tobi,
      player1Tobashi: player1Tobashi,
      player2Tobashi: player2Tobashi,
      player3Tobashi: player3Tobashi,
      player4Tobashi: player4Tobashi,
      resultArr: resultArr_
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
    buttobi_ = settingObj.buttobi * 1;
    ratio_ = settingObj.ratio * 1;
    // chip_ = settingObj.chip * 1;
    resultArr_ = settingObj.resultArr;

    player1Score = settingObj.player1Score;
    player2Score = settingObj.player2Score;
    player3Score = settingObj.player3Score;
    player4Score = settingObj.player4Score;
    player1yakitori = settingObj.player1yakitori;
    player2yakitori = settingObj.player2yakitori;
    player3yakitori = settingObj.player3yakitori;
    player4yakitori = settingObj.player4yakitori;

    player1Tobi = settingObj.player1Tobi;
    player2Tobi = settingObj.player2Tobi;
    player3Tobi = settingObj.player3Tobi;
    player4Tobi = settingObj.player4Tobi;
    player1Tobashi = settingObj.player1Tobashi;
    player2Tobashi = settingObj.player2Tobashi;
    player3Tobashi = settingObj.player3Tobashi;
    player4Tobashi = settingObj.player4Tobashi;

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
    $('#buttobi').val(buttobi_);
    $('#ratio').val(ratio_);
    // $('#chip').val(chip_);

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

    $("#player1Tobi").prop('checked', player1Tobi);
    $("#player2Tobi").prop('checked', player2Tobi);
    $("#player3Tobi").prop('checked', player3Tobi);
    $("#player4Tobi").prop('checked', player4Tobi);
    $("#player1Tobashi").prop('checked', player1Tobashi);
    $("#player2Tobashi").prop('checked', player2Tobashi);
    $("#player3Tobashi").prop('checked', player3Tobashi);
    $("#player4Tobashi").prop('checked', player4Tobashi);

    // 結果の復帰
    for (var i = 0; i < resultArr_.length; i++) {
      var result = resultArr_[i];

      // 結果を末尾に追加
      appendNewResult(result);
    }
    calcBalance();
  }

  var calcBalance = function() {
    var totalScore = 0;
    $(".playersScore").each(function() {
      totalScore += $(this).val() * 1;
    });
    balance_ = totalMochi_ - totalScore;
    document.getElementById("balance").innerText = "残り: " + balance_ + "点";
  }

  var calcTotalResult = function() {
    var totalResultArr = [];
    for (var i = 0; i < 4; i++) {
      var totalResult = 0;
      for (var j = 0; j < resultArr_.length; j++) {
        totalResult += resultArr_[j]["player" + (i + 1)] * 1;
      }
      totalResultArr.push(totalResult);
    }
    return totalResultArr;
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

  // ボタンのイベントを登録
  $("#btnAdd").click(add);
  $("#btnDelete").click(deleteRow);
  $("#btnDeleteAll").click(deleteAll);

  //設定保存ボタン
  $("#btnSaveSetting").click(saveSetting);

  // ［リセット］ボタンのイベントを登録
  $("#btnReset").click(reset);

  $(".playersScore").change(calcBalance);

  // メモの復帰
  restoreApp();
});
