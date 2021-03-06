/*
 * @Description: 刷宝自动化脚本
 * @Author: Allen
 * @Date: 2020-09-14 09:04:54
 * @LastEditors: Allen
 * @LastEditTime: 2020-10-16 11:45:41
 */

console.show();

const height = device.height;
const width = device.width;
setScreenMetrics(width, height);
let dateArr = [];
let count = 0;
let timeList = [];
let timeCount = 0;
for (let index = 1; index < 15; index++) {
  timeList.push(Format(add(new Date(), 15 * index), "hh:mm"));
}

log(timeList);

const see_count = 4000;
log("开始运行脚本");
log("准备打开刷宝短视频");
launchApp("刷宝短视频");
textContains("首页").waitFor();
log("刷宝短视频已打开");
sleep(1000);
// 看视频领元宝
layProgress();
sleep(1000);
handleTask();

function handleTask() {
  sleep(1000);
  click("任务");
  log("进入任务页面");
  sleep(2000);
  // 判断是否存在去邀请好友弹框;
  log("是否存在去邀请好友弹框", className("android.widget.ImageView").id("imgClose").exists());

  if (className("android.widget.ImageView").id("imgClose").exists()) {
    className("android.widget.ImageView").id("imgClose").findOne().click();
  }

  sleep(2000);
  textContains("继续赚元宝").waitFor();

  // 获取已观看次数
  log("获取已观看次数");
  const text = className("android.view.View").textContains("已观看").findOne().text();
  const number = Number(text.replace(/[^0-9]/gi, ""));
  log(number);
  if (number < 10) {
    log("创建去观看任务时间表");
    log(number);
    for (let index = 1; index <= 10 - number; index++) {
      dateArr.push(Format(add(new Date(), 6 * index), "hh:mm"));
    }
    log("创建完成", dateArr);
    sleep(1000);
  } else {
    log("观看任务已完成");
  }
  click("首页");
  handleStart();
}

function handleStart() {
  for (var i = 1; i < see_count; i++) {
    log(dateArr[count], timeList[timeCount]);
    if (Format(new Date(), "hh:mm") == dateArr[count]) {
      log("进行去观看第" + count + "次任务");
      handleTaskVideo();
    } else if (Format(new Date(), "hh:mm") == timeList[timeCount]) {
      log();
      log("进行领宝箱任务", timeList[timeCount]);
      sleep(1000);
      click("任务");
      log("点击任务1");
      textContains("继续赚元宝").waitFor();
      log("开箱领元宝", textContains("开箱领元宝").exists());
      // 判断是否可以开箱领元宝
      if (textContains("开箱领元宝").exists()) {
        log("存在开箱领元宝任务");
        textContains("开箱领元宝").findOne().parent().click();
        log("进行开箱领元宝任务");
        sleep(1000);

        /**
         * 测试是否生效
         */
        textContains("额外领取").findOne().click();

        // const clickStatus = click("额外领取188元宝");
        // if (!clickStatus) {
        //   click("额外领取88元宝");
        // }

        log("点击了额外领取");

        id("tt_video_ad_close_layout").waitFor();
        id("tt_video_ad_close_layout").findOne().click();
        log("完成开箱领元宝");
        sleep(1000);

        className("android.view.View")
          .depth(7)
          .untilFind()
          .forEach((item) => {
            if (item.indexInParent() === 0) {
              if (item.clickable()) {
                item.click();
              }
            }
          });
      }

      timeCount = timeCount + 1;
      sleep(800);
      click("首页");
    } else if (!id("layProgress").exists()) {
      log("刷宝短视频未打开");
      launchApp("刷宝短视频");
      textContains("首页").waitFor();
      toast("滑动" + i + "次" + "总计:" + see_count + "次");
      slideScreenDown();
    } else {
      toast("滑动" + i + "次" + "总计:" + see_count + "次");
      slideScreenDown();
    }
  }
}

// 红包视频任务
function layProgress() {
  const layProgress = id("layProgress").findOne();
  click(layProgress.bounds().centerX(), layProgress.bounds().centerY());
  textContains("看视频领元宝").waitFor();
  // sleep(3000);
  log("是否存在立即观看", textContains("立即观看").exists());
  if (textContains("立即观看").exists()) {
    while (textContains("立即观看").exists()) {
      textContains("立即观看").findOne().click();
      id("tt_video_ad_close_layout").waitFor();
      id("tt_video_ad_close_layout").findOne().click();
      sleep(2000);
    }
  }

  log("看视频任务已完成");

  back();
}

function handleTaskVideo() {
  log("定时器" + count);
  status = true;
  if (count > 10) {
    return;
  }

  click("任务");
  log("点击任务");
  sleep(1000);
  // 判断是否存在去邀请好友弹框;
  log("是否存在去邀请好友弹框", className("android.widget.ImageView").id("imgClose").exists());

  if (className("android.widget.ImageView").id("imgClose").exists()) {
    className("android.widget.ImageView").id("imgClose").findOne().click();
  }
  textContains("继续赚元宝").waitFor();
  log("去观看", textContains("去观看").exists());
  if (textContains("去观看").exists()) {
    log("点击去观看");
    textContains("去观看").findOne().click();
    // 判断广告结束是否出现关闭按钮
    id("tt_video_ad_close_layout").waitFor();
    id("tt_video_ad_close_layout").findOne().click();
    sleep(1000);
    className("android.view.View")
      .depth(7)
      .untilFind()
      .forEach((item) => {
        if (item.indexInParent() === 0) {
          if (item.clickable()) {
            item.click();
          }
        }
      });
    log("观看结束");
  } else {
    log("去观看不存在哦~!");
  }

  count = count + 1;
  click("首页");
}

/**
 * 屏幕向下滑动并延迟8至12秒
 */
function slideScreenDown() {
  let randomIndex = random(1, 50);
  let delayTime = random(9000, 12000);

  if (randomIndex == 6) {
    pressTime = random(200, 500);
    swipe(width / 2, 200, width / 2, height - 200, 700);
    sleep(200, 500);
  }

  if (randomIndex == 10) {
    swipe(width / 2, height / 2 + 300, width / 2, 0, 700);
    sleep(2000);
    swipe(width / 2, height / 2 + 300, width / 2, 0, 700);
    sleep(1000);

    sleep(delayTime);
  }
  swipe(width / 2, height / 2 + 300, width / 2, 0, 700);

  // 判断是否是直播
  log("是否存在praise", id("praise").exists());
  if (!id("praise").exists()) {
    sleep(1000);
    swipe(width / 2, height / 2 + 100, width / 2, 0, 800);
    slideScreenDown();
    log("下一个");
  }

  sleep(delayTime); //模仿人类随机时间
}

// 日期处理函数
function Format(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
}

function add(date, num) {
  date.setMinutes(date.getMinutes() + num);
  return date;
}
