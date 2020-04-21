<template>
  <div >
    <p
      style="margin-top: 34px"
    >Daha önceki rezervasyonlarınızı görüntülemek için email adresinizi giriniz</p>
    <b-form-input class="mt-3" v-model="email" placeholder="E posta adresiniz"></b-form-input>
    <b-row align-h="end">
      <b-col cols="auto">
        <b-button class="mt-2" @click="clickSearch">
          <b-spinner small v-if="loading===true" style="margin-right: 5px"></b-spinner>Ara
        </b-button>
      </b-col>
    </b-row>
    <b-alert show variant="danger" v-if="reservations!==null && reservations.length===0" class="mt-2"> Bu emaile ait kayıtlı rezervasyon yok.</b-alert>
    <div v-for="(item,index) in reservations" :key="index">
      <b-row>
        <b-col>
          <div>Oda seçiminiz: {{item.roomId.name}}</div>
        </b-col>
        <b-col cols="auto">
          <div>Fiyat: {{item.totalPrice}}</div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import API from "../axios";

export default {
  data() {
    return {
      email: null,
      reservations: null,
      loading: false
    };
  },
  methods: {
    async clickSearch() {
      this.loading = true;
      try {
          
          const response = await API.get("/v1/reservations?email=" + this.email);
          this.reservations = response.data.listedReservation;
      } catch (error) {
          this.reservations = []
          
      }
      this.loading = false;
    }
  }
};
</script>

<style>
</style>