/<template>
  <div class="xClassCallout">
      <h1 class="xTitle xHeading" v-html="heading"></h1>
      <h2 class="xTitle xByline" v-html="byline"></h2>
      <p class="xCopy xContentBody" v-html="description"></p>
  </div>
</template>

<script>
export default {
    props: {
        heading: String,
        byline: String,
        description: String
    }
}
</script>

<style>

</style>