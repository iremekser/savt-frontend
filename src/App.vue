<template>
  <div id="app">
    <b-row>
      <b-col xs="0" sm="0" md="3" lg="3" class="p-4 ">
        <h5 class="ml-3" >Menü</h5>
        <div>
          <b-button href="/" variant="link">Anasayfa</b-button>
        </div>
        <div>
          <b-button href="/my-reservations" variant="link">Rezervasyonlarım</b-button>
        </div>
        <div>
          <b-button href="/admin" variant="link">Envanter</b-button>
        </div>
      </b-col>
      <b-col xs="12" sm="12" md="9" lg="9">
        <b-row>
          <b-col xs="12" sm="12" md="10" lg="10">
            <router-view class="m-3" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>
