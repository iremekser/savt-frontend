<template>
  <div >
  

       
    <div v-if="step === 1">
      <h2 class="mt-3">{{room.name}}</h2>
      <img class="w-100 room-image" :src="room.photo" />
      <b-row align-h="between">
        <b-col>
          <div class="mt-2">Oda Tipi: {{room.roomType.name}}</div>
          <div>Yatak Sayisi: {{room.roomType.bedCount}}</div>
        </b-col>
        <b-col cols="auto">
          <div class="price">{{room.roomType.price}}₺</div>
        </b-col>
      </b-row>
      <hr />
      <h5>Ekstra Servisler</h5>
      <b-row>
        <b-col cols="4" v-for="(item,index) in room.extraServices" :key="index">
          <div>
            <b-form-checkbox v-model="item.selected" class="carpark">{{item.name}} {{item.price}}₺</b-form-checkbox>
          </div>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <b-form-checkbox v-model="hasCarpark" class="carpark">
            Otopark hizmeti
            <span>Günlük 10 ₺</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col cols="6">
          Giriş Tarihi
          <b-form-datepicker v-model="startDate" :min="new Date()" locale="tr"></b-form-datepicker>
        </b-col>
        <b-col cols="6">
          Çıkış Tarihi
          <b-form-datepicker v-model="endDate" :min="startDate" locale="tr"></b-form-datepicker>
        </b-col>
      </b-row>
      <hr />
      <b-row align-h="end">
        <b-col cols="auto">
          <div class="price">{{totalPrice}} ₺</div>
        </b-col>
      </b-row>
      <hr />
      <b-row align-h="end">
        <b-col cols="auto">
          <div class="price">
            <b-button :disabled="!endDate" variant="success" @click="step = 2">İlerle</b-button>
          </div>
        </b-col>
      </b-row>
      <hr />
    </div>
    <div v-if="step===2">
      <h3>Rezervasyon Özeti</h3>
      <div>Oda Adınız : {{room.name}}</div>
      <div>Oda Tipiniz : {{room.roomType.name}}</div>
      <div>Otopark Seçiminiz : {{hasCarpark ? 'Var':'Yok'}}</div>
      <div>
        Ekstra Seçimleriniz :
        <b-row v-if="selectedExtras.length> 0">
          <b-col cols="4" v-for="(item,index) in selectedExtras" :key="index">
            <div>{{item.name}}</div>
          </b-col>
        </b-row>
        <span v-else>Seçim Yok</span>
      </div>
      <div>Giris Tarihi : {{startDateString}}</div>
      <div>Çıkış Tarihi : {{endDateString}}</div>
      <div>Toplam Fiyat : {{totalPrice}}</div>
      <hr />
      <b-form-input class="mb-2" v-model="fullName" placeholder="Ad soyad"></b-form-input>
      <b-form-input class="mb-2" v-model="email" placeholder="E posta adresiniz"></b-form-input>
      <b-form-input class="mb-2" v-model="mobile" placeholder="Telefon numaranız"></b-form-input>
      <hr />
      <b-row align-h="end">
        <b-col cols="auto">
          <b-button variant="link" @click="step = 1">Geri Dön</b-button>
          <b-button variant="success" @click="clickReservation">
            <b-spinner small v-if="loading===true"></b-spinner>Rezervasyonu Tamamla
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div v-if="step===3">
      <center>
        <div style="font-size:70px;color:green;margin-top:12px">
          <b-icon icon="check-all"></b-icon>
        </div>
        <div style="font-size:40px">Rezervasyonu Tamamladınız</div>
        <div style="font-size:30px">Görüşmek Üzere...</div>
        <b-button variant="link" @click="clickHome">Anasayfaya Dön</b-button>
      </center>
    </div>
   
  </div>
</template>

<script>
import API from "../axios";
import router from "../router";
export default {
  data() {
    return {
      room: null,
      hasCarpark: false,
      startDate: new Date(),
      endDate: null,
      step: 1,
      fullName: null,
      email: null,
      mobile: null,
      loading: false
    };
  },
  computed: {
    selectedExtras() {
      return this.room.extraServices.filter(x => x.selected === true);
    },
    startDateString() {
      return (
        new Date(this.startDate).getFullYear() +
        "-" +
        new Date(this.startDate).getMonth() +
        "-" +
        new Date(this.startDate).getDate()
      );
    },
    endDateString() {
      return (
        new Date(this.endDate).getFullYear() +
        "-" +
        new Date(this.endDate).getMonth() +
        "-" +
        new Date(this.endDate).getDate()
      );
    },
    dayCount() {
      const day = Math.ceil(
        (new Date(this.endDate) - new Date(this.startDate)) /
          60 /
          60 /
          24 /
          1000
      );
      return day == 0 ? 1 : day;
    },
    totalPrice() {
      if (this.dayCount < 0) return 0;
      let sum = 0;
      if (this.hasCarpark) sum += 10 * this.dayCount;
      this.room.extraServices.forEach(element => {
        if (element.selected) sum += element.price * this.dayCount;
        else console.log("asdf");
      });
      sum += this.room.roomType.price * this.dayCount;
      return sum;
    }
  },
  async created() {
    const roomId = this.$route.params.id;
    const response = await API.get("/v1/rooms/" + roomId);
    this.room = response.data.findRoom;
  },
  methods: {
    async clickReservation() {
      this.loading = true;
      const res = await API.post("/v1/customers", {
        fullName: this.fullName,
        email: this.email,
        mobile: this.mobile
      });
      const customerId = res.data.user._id;
      await API.post("/v1/reservations", {
        customerId: customerId,
        roomId: this.room._id,
        startDate: this.startDate,
        endDate: this.endDate,
        hasCarpark: this.hasCarpark,
        selectedExtras: this.selectedExtras.map(n => n._id)
      });
      this.loading = false;
      this.step = 3;
    },
    clickHome() {
      router.push("/");
    }
  }
};
</script>

<style>
.room-image {
  height: 400px;
  object-fit: cover;
}
.price {
  font-size: 33px;
}
.carpark span {
  color: grey;
  font-size: 12px;
}
</style>