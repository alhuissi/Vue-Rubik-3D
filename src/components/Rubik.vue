<template>
  <div style="background-color:rgba(0,0,0,0);padding-top:1vh;padding-bottom:1vh;">
    <div id="madeByContainer">
      made by <br />
      <a
        href="https://www.thedeval.com"
        target="_blank"
        style="color:white!important;text-decoration:none!important;"
      >
        <img src="../assets/logo.png" class="logo-deval" /><br />deval
      </a>
    </div>
    <transition>
      <span class="msg">{{ steps }}</span>
    </transition>
    <div id="barraLateral">
      <el-button
        type="secondary"
        style="font-size:25px;margin:5px;padding:15px;"
        :loading="randomRotateLoading"
        :disabled="status"
        @click="randomRotate"
      >
        <el-icon>
          <Refresh />
        </el-icon>
      </el-button>
      <br />
      <el-button
        type="secondary"
        style="font-size:25px;margin:5px;padding:15px;"
        :loading="autoRestRunning"
        :disabled="status"
        @click="autoRest"
      >
        <el-icon>
          <Check />
        </el-icon>
      </el-button>
      <br />
      <el-button
        type="secondary"
        style="font-size:25px;margin:5px;padding:15px;"
        :disabled="status"
        @click="autoRestOneStep"
      >
        <el-icon>
          <ArrowRight />
        </el-icon>
      </el-button>
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
import scanner from "./scanner.vue";

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
    this._keydownHandler = event => {
      const keyCode = event.keyCode || event.which;
      if ((event.code === "Space" || keyCode === 32) && !this.status) {
        event.preventDefault();
        this.autoRestOneStep();
      }
    };
  },

  mounted() {
    const isMobile = this._isMobile();
    if (isMobile) {
      this.off = 3;
      this.mobile = true;
      this.height = "0px";
      this.width = String(window.innerWidth / 2) + "px";
    } else {
      this.width = String(window.innerWidth / 8) + "px";
    }
    init(isMobile);
    this._intervalId = setInterval(this.updateTime, 100);
    window.addEventListener("keydown", this._keydownHandler);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this._keydownHandler);
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
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
      Array.from(document.getElementsByName("txt") || []).forEach(span => {
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
  left:47vw;
  height: 30px;
  top: 5vh;
  color: white;
  font-size: 40px;
  	color: #fff;
	text-shadow:
		0 0 5px rgba(0,178,255,0.7),
		0 0 10px rgba(0,178,255,0.7),
		0 0 20px rgba(0,178,255,0.7),
		0 0 40px rgba(38,104,127,1),
		0 0 80px rgba(38,104,127,1),
		0 0 90px rgba(38,104,127,1),
		0 0 100px rgba(38,104,127,1),
		0 0 140px rgba(38,104,127,1),
		0 0 180px rgba(38,104,127,1);
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
  position:relative;
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
  #madeByContainer{
    position:fixed;
    color: white;
    left:5vw;
    bottom: 5vh;
    font-weight:600;
  }
</style>
