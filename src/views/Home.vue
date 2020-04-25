<template>
  <div>
    <h2>Odalar</h2>
    <b-row class="p-2">
      <b-col xs="12" sm="12" md="4" lg="4" v-for="(room,index) in rooms" :key="index">
        <b-card
          :title="room.name"
          :img-src="room.photo"
          img-alt="Image"
          img-height="200"
          tag="article"
          class="mb-2"
        >
          <b-card-text>
            <div>Yatak sayısı : {{room.roomType.bedCount}}</div>
            <div>Fiyat : {{room.roomType.price}}</div>
            <div>{{room.extraServices.length}} adet ekstra servis var</div>
          </b-card-text>

          <b-button :href="'/reservation/'+room._id" variant="primary">Rezervasyon Yap</b-button>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import API from "../axios";
export default {
  data() {
    return {
      rooms: null
    };
  },
  async created() {
    const rooms = await API.get("/v1/rooms");
    this.rooms = rooms.data.listedRoom;
  }
};
</script>

<style scoped>
img{
  object-fit: cover;
}
</style>
