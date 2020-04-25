<template>
  <div>
    <b-row align-h="center">
      <b-col xs="12" sm="12" md="4" lg="4" style="margin-top:30px">
        <b-form-group label="Kullanıcı Adı" label-for="input-vertical">
          <b-form-input v-model="username"></b-form-input>
        </b-form-group>
        <b-form-group label="Şifre" label-for="input-vertical">
          <b-form-input type="password" v-model="password"></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-row align-h="end">
            <b-col cols="auto">
              <b-button class="mt-2" @click="login">
                <b-spinner small v-if="loading===true" style="margin-right: 5px"></b-spinner>Giriş
              </b-button>
            </b-col>
          </b-row>
        </b-form-group>
        <b-alert show variant="danger" v-if="error" class="mt-2">Hatalı giriş</b-alert>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import router from "../router";
export default {
  data() {
    return {
      loading: false,
      username: null,
      password: null,
      error: false
    };
  },
  methods: {
    login() {
      this.loading = true;
      setTimeout(() => {
        if (this.username === "admin" && this.password === "12345") {
          router.push("/admin/inventory");
        } else {
          this.error = true;
        }
        this.loading = false;
      }, 2000);
    }
  }
};
</script>

<style>
</style>