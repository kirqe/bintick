<template lang="html">
  <div class="list-item-options">
    <!-- <div class="container">
      <div class="columns">
        <div class="column"> -->

          <div class="field">
            <label class="label is-small">Holdings:</label>
            <div class="control">
              <input class="input is-small" type="text" placeholder="Quantity">
            </div>
            <!-- <p class="help">This is a help text</p> -->
          </div>

          <div class="field">
            <label class="label is-small">Show notification when price is: </label>
            <div class="control">
              <input class="input is-small" type="number" :placeholder="this.placeholderAbove"
              @click="setAboveDefault()">
            </div>
            <!-- <p class="help">This is a help text</p> -->
          </div>

          <div class="field">
            <div class="control">
              <input class="input is-small" type="number" :placeholder="this.placeholderBelow">
            </div>
            <!-- <p class="help">This is a help text</p> -->
          </div>

          <div class="field">
            <div class="control">
              <label class="radio">
                <input type="radio" name="foobar">
                1 time
              </label>
              <label class="radio">
                <input type="radio" name="foobar" checked>
                Permanent
              </label>
              <a class="button is-success is-small is-pulled-right">Save</a>

              <a class="button is-small is-pulled-right" @click="tryNotification()">Try me</a>
            </div>



          </div>

          <!-- <div class="field">
            <div class="control">
              <a class="button is-success is-small is-pulled-right">Save</a>
            </div>

            <div class="control">
              <a class="button is-small is-pulled-right" @click="tryNotification()">Try me</a>
            </div>
          </div> -->

        <!-- </div>
      </div>
    </div> -->

  </div>
</template>

<script>
export default {
  props: ["crypto"],
  data () {
    return {

    }
  },
  computed: {
    placeholderAbove () {
      return `above ${(this.crypto.last + 0.00000001).toFixed(8)} ${this.crypto.baseCurrency}`
    },
    placeholderBelow () {
      return `below ${(this.crypto.last - 0.00000001).toFixed(8)} ${this.crypto.baseCurrency}`
    }
  },
  methods: {
    setAboveDefault () {
      return this.crypto.last;
    },
    tryNotification () {
      var opt = {
        type: "basic",
        title: `${this.crypto.marketName} is above `,
        message: "Primary message to display",
        iconUrl: "./logo.png"
      }

      chrome.notifications.create(opt);
    }
    // setNotificationVal(direction) {
    //   if (direction === "above") {
    //     return (this.crypto.last + 0.00000001).toFixed(8)
    //   }else if (direction === "below") {
    //     return (this.crypto.last - 0.00000001).toFixed(8)
    //   }
    //
    // }
  }
}
</script>

<style lang="css">
</style>
