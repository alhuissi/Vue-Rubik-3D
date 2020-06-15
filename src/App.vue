<template>
  <div id="app">
    <Rubik/>
  </div>
</template>

<script>
import Rubik from './components/Rubik'

export default {
  name: 'App',
  components: {
    Rubik
  },
    metaInfo: {
    title: "Rubik",
    titleTemplate: "%s ",
    htmlAttrs: {
      lang: "es",
      amp: true,
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "Rubik's cube game with Javascript and ThreeJS",
      },
      {
        property: "og:title",
        content: "Rubiks",
      },
      { property: "og:site_name", content: "Rubiks" },
      { property: "og:description", content: "Rubik's cube game with Javascript and ThreeJS" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index,follow" }
    ]
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
