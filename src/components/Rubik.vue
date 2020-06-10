<template>
  <div style="background-color:rgba(0,0,0,0);padding-top:1vh;padding-bottom:1vh;">

        <a href="https://www.thedeval.com" target="_blank">
          <img src="../assets/logo.png" v-transition class="logo-deval">
          </a>
        <span v-transition class="msg">{{ steps }}</span>
        <div id="barraLateral">
          
        <el-button
          type="primary"
          icon="el-icon-refresh"
          circle
          style="font-size:30px;"
          @click="randomRotate"
          :loading="randomRotateLoading"
          :disabled="status"
        ></el-button><br/>
        <el-button
          type="success"
          icon="el-icon-success"
          circle
          style="font-size:30px;"
          @click="autoRest"
          :loading="autoRestRunning"
          :disabled="status"
        ></el-button><br/>
        <el-button
          type="success"
          icon="el-icon-arrow-right"
          circle
          style="font-size:30px;"
          @click="autoRestOneStep"
          :disabled="status"
        ></el-button>
</div>


  </div>
</template>

<script>
import {
  init,
  randomRotate,
  autoRest,
  autoRestOneStep,
  randomRotateLoading,
  autoRestRunning,
  changeSpeed,
  acceptStringRunning,
  stepCount,
  acceptMethod,
  clearAll,
  autoRunOneStep
} from "../utils/Rubik.js";
import scanner from "./scanner";

export default {
  name: "Rubik",
  components: {
    scanner
  },
  data() {
    return {
      randomRotateLoading: false,
      autoRestRunning: false,
      acceptStringRunning: false,
      speed: 200,
      off: 3,
      mobile: false,
      height: "",
      width: "",
      steps: 0,
      play: "Free mode",
      method: "Please select a style",
      dialogVisible: false,
      options: [
        {
          value: "Hexagrams",
          label: "Hexagrams"
        },
        {
          value: "Four-color back word",
          label: "Four-color back word"
        },
        {
          label: "Symmetrical chessboard",
          value: "Symmetrical chessboard"
        },
        {
          label: "Circular checkerboard",
          value: "Circular checkerboard"
        },
        {
          label: "Six-sided cross",
          value: "Six-sided cross"
        },
        {
          label: "Four sides cross",
          value: "Four sides cross"
        },
        {
          label: "Six-sided color bar",
          value: "Six-sided color bar"
        },
        {
          label: "Six sides and three strips",
          value: "Six sides and three strips"
        }
      ]
    };
  },

  created() {
    var _this = this;
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      if (key === 32 && !_this.status) {
        _this.autoRestOneStep();
      }
    };
  },

  mounted() {
    if (this._isMobile()) {
      this.off = 4;
      this.mobile = true;
      this.height = "150px";
      this.width = String(window.innerWidth / 2) + "px";
    } else {
      this.width = String(window.innerWidth / 8) + "px";
    }
    init(this._isMobile());
    setInterval(this.updateTime, 100);

    // LBBRRURRRDDRDDLDLDFFFFFFFFFUUUUUDUBLBDBLBBLLBLRURLBRUD
    // LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
    // DBULUFLUBLDFFRLBLRFFDRFLLUUBBRDDUURDFDDBLULRURDRBBRBFF
  },

  methods: {
    async randomRotate() {
      if (this.play === "Free mode") {
        this.randomRotateLoading = true;
        randomRotate(this.speed);
        while (this.randomRotateLoading) {
          await this.sleep(this.speed * 2);
          this.randomRotateLoading = randomRotateLoading;
        }
      } else if (this.play === "Practice mode") {
        clearAll();
      }
    },

    async autoRest() {
      if (this.play === "Free mode") {
        this.autoRestRunning = true;
        autoRest(this.speed);
        while (this.autoRestRunning) {
          await this.sleep(this.speed * 2);
          this.autoRestRunning = autoRestRunning;
        }
      } else if (this.play === "Practice mode") {
        switch (this.method) {
          case "Hexagrams":
            acceptMethod("U' D F' B L R' U' D", this.speed);
            break;
          case "Four-color back word":
            acceptMethod("B2 L R B L2 B F D U' B F R2 F' L R", this.speed);
            break;
          case "Symmetrical chessboard":
            acceptMethod("L2 R2 F2 B2 U2 D2", this.speed);
            break;
          case "Circular checkerboard":
            acceptMethod(
              "D2 F2 U' B2 F2 L2 R2 D R' B F D' U L R D2 U2 F' U2",
              this.speed
            );
            break;
          case "Six-sided cross":
            acceptMethod("B2 F' L2 R2 D2 B2 F2 L2 R2 U2 F'", this.speed);
            break;
          case "Four sides cross":
            acceptMethod("D F2 R2 F2 D' U R2 F2 R2 U'", this.speed);
            break;
          case "Six-sided color bar":
            acceptMethod("F2 U2 F2 B2 U2 F B", this.speed);
            break;
          case "Six sides and three strips":
            acceptMethod(
              "U2 L2 U2 L2 U2 L2 U2 R2 U2 R2 U2 R2 U D L2 R2",
              this.speed
            );
            break;
          default:
            return "Please select a style";
        }
        this.playMethod();
      }
    },

    async autoRestOneStep() {
      if (this.play === "Free mode") {
        this.autoRestRunning = true;
        autoRestOneStep(this.speed);
      } else if (this.play === "Practice mode") {
        this.autoRestRunning = true;
        switch (this.method) {
          case "Hexagrams":
            autoRunOneStep("U' D F' B L R' U' D", this.speed, this.steps);
            break;
          case "Four-color back word":
            autoRunOneStep(
              "B2 L R B L2 B F D U' B F R2 F' L R",
              this.speed,
              this.steps
            );
            break;
          case "Symmetrical chessboard":
            autoRunOneStep("L2 R2 F2 B2 U2 D2", this.speed, this.steps);
            break;
          case "Circular checkerboard":
            autoRunOneStep(
              "D2 F2 U' B2 F2 L2 R2 D R' B F D' U L R D2 U2 F' U2",
              this.speed,
              this.steps
            );
            break;
          case "Six-sided cross":
            autoRunOneStep(
              "B2 F' L2 R2 D2 B2 F2 L2 R2 U2 F'",
              this.speed,
              this.steps
            );
            break;
          case "Four sides cross":
            autoRunOneStep(
              "D F2 R2 F2 D' U R2 F2 R2 U'",
              this.speed,
              this.steps
            );
            break;
          case "Six-sided color bar":
            autoRunOneStep("F2 U2 F2 B2 U2 F B", this.speed, this.steps);
            break;
          case "Six sides and three strips":
            autoRunOneStep(
              "U2 L2 U2 L2 U2 L2 U2 R2 U2 R2 U2 R2 U D L2 R2",
              this.speed,
              this.steps
            );
            break;
          default:
            return "Please select a style";
        }
      }

      while (this.autoRestRunning) {
        await this.sleep(this.speed * 1.5);
        this.autoRestRunning = autoRestRunning;
      }
    },

    async statusChange() {
      this.acceptStringRunning = true;
      while (this.acceptStringRunning) {
        await this.sleep(100);
        this.acceptStringRunning = acceptStringRunning;
      }
    },

    async playMethod() {
      this.acceptStringRunning = true;
      while (this.acceptStringRunning) {
        await this.sleep(this.speed * 1.5);
        this.acceptStringRunning = acceptStringRunning;
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      document.getElementsByName("txt").forEach(span => {
        span.style.fontSize = "26px";
      });
      return flag;
    },

    updateTime() {
      this.steps = stepCount;
    },

    changePlay() {
      if (this.status) return;
      if (this.play === "Free mode") this.play = "Practice mode";
      else this.play = "Free mode";
    },

    selectMethod() {
      if (this.status) return;
      this.dialogVisible = true;
    }
  },

  computed: {
    status() {
      return (
        this.randomRotateLoading ||
        this.autoRestRunning ||
        this.acceptStringRunning
      );
    }
  },

  watch: {
    speed() {
      changeSpeed(this.speed);
    },

    method() {
      this.dialogVisible = false;
      switch (this.method) {
        case "Hexagrams":
          acceptMethod("U' D F' B L R' U' D", this.speed);
          break;
        case "Four-color back word":
          acceptMethod("B2 L R B L2 B F D U' B F R2 F' L R", this.speed);
          break;
        case "Symmetrical chessboard":
          acceptMethod("L2 R2 F2 B2 U2 D2", this.speed);
          break;
        case "Circular checkerboard":
          acceptMethod(
            "D2 F2 U' B2 F2 L2 R2 D R' B F D' U L R D2 U2 F' U2",
            this.speed
          );
          break;
        case "Six-sided cross":
          acceptMethod("B2 F' L2 R2 D2 B2 F2 L2 R2 U2 F'", this.speed);
          break;
        case "Four sides cross":
          acceptMethod("D F2 R2 F2 D' U R2 F2 R2 U'", this.speed);
          break;
        case "Six-sided color bar":
          acceptMethod("F2 U2 F2 B2 U2 F B", this.speed);
          break;
        case "Six sides and three strips":
          acceptMethod(
            "U2 L2 U2 L2 U2 L2 U2 R2 U2 R2 U2 R2 U D L2 R2",
            this.speed
          );
          break;
        default:
          return "Please select a style";
      }
      this.playMethod();
    }
  }
};
</script>

<style scoped>
.refreash {
  align-content: left;
}

.el-button + .el-button {
  margin-left: 0;
}

.step {
  text-align: center;
  font-size: 40px;
}

.msg {
  position:fixed;
  transition: all 0.3s ease;
  height: 30px;
  top: 5vh;
  color: white;
  font-size: 40px;
}

.msg.v-enter,
.msg.v-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}

.txt {
  z-index: 9;
  -webkit-user-select: none;
  cursor: pointer;
}
.logo-deval{
  position:fixed;
  top:5vh;
  left:5vw;
  height:7vh;
  cursor:pointer;
  transition: all 725ms ease;
}
.logo-deval:hover{
  transform: rotateY(180deg);
  }
  #barraLateral{
    position: fixed;
    right: 5vw;
    top:5vh;
  }
</style>
