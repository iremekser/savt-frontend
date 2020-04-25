<template>
  <div>
      <h3>Envanter</h3>
    <table class="table">
      <tr>
        <th>Ad</th>
        <th>Adet</th>
        <th>Fiyat</th>
        <th>Limit</th>
        <th></th>
        <th>Durum</th>
      </tr>
      <tr v-for="(item,index) in inventories" :key="index">
        <td>
          <contenteditable
            tag="div"
            :class="{edit:item.editMode}"
            :contenteditable="item.editMode"
            v-model="item.name"
            :noNL="true"
          />
        </td>
        <td>
          <contenteditable
            tag="div"
            :class="{edit:item.editMode}"
            :contenteditable="item.editMode"
            v-model="item.amount"
            :noNL="true"
          />
        </td>
        <td>
          <contenteditable
            tag="div"
            :class="{edit:item.editMode}"
            :contenteditable="item.editMode"
            v-model="item.price"
            :noNL="true"
          />
        </td>
        <td>
          <contenteditable
            tag="div"
            :class="{edit:item.editMode}"
            :contenteditable="item.editMode"
            v-model="item.limit"
            :noNL="true"
          />
        </td>
        <td>
          <b-button
            size="sm"
            class="mr-2"
            variant="link"
            style="color:red"
            @click="del(item._id)"
          >Sil</b-button>
          <b-button
            size="sm"
            style="color:orange"
            variant="link"
            v-if="!item.editMode"
            @click="item.editMode=true"
          >Düzenle</b-button>
          <b-button size="sm" variant="link" v-if="item.editMode" @click="save(item)">Kaydet</b-button>
        </td>
        <td>
          <b-icon
            v-b-tooltip.hover.v-danger.lefttop="'Miktar limitin altında!'"
            v-if="item.amount<item.limit"
            icon="exclamation-triangle"
            style="color:red"
          ></b-icon>
        </td>
      </tr>
    </table>
    <hr style="border-width:5px; border-color:#E8E8E8;  border-radius:2px">
    <b-row>
      <b-col>
        <b-form-group label="Name" label-for="input-vertical">
          <b-form-input v-model="name"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Amount" label-for="input-vertical">
          <b-form-input v-model="amount"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Price" label-for="input-vertical">
          <b-form-input v-model="price"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Limit" label-for="input-vertical">
          <b-form-input v-model="limit"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row align-h="end">
      <b-col cols="auto">
        <b-button variant="success" @click="add">Ekle</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import API from "../axios";
export default {
  data() {
    return {
      inventories: null,
      name: null,
      amount: null,
      price: null,
      limit: null
    };
  },
  async created() {
    const inventories = await API.get("/v1/inventories");
    this.inventories = inventories.data.inventory.map(n => {
      return {
        ...n,
        editMode: false
      };
    });
  },
  methods: {
    async del(id) {
      this.$bvModal
        .msgBoxOk("Silmek istediğinizden emin misiniz?", {
          title: "Uyarı",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true
        })
        .then(async () => {
          await API.delete("/v1/inventories/" + id);
          this.$bvToast.toast("Ürün silindi", {
            title: "Silindi.",
            variant: "danger",
            autoHideDelay: 5000
          });
          this.inventories = this.inventories.filter(n => n._id != id);
        })
        .catch(() => {
        });
    },
    async add() {
      const savedInventory = await API.post("/v1/inventories/", {
        name: this.name,
        amount: this.amount,
        price: this.price,
        limit: this.limit
      });
      this.inventories.push(savedInventory.data.savedInventory);
    },
    async save(item) {
      await API.put("/v1/inventories/" + item._id, {
        name: item.name,
        amount: item.amount,
        price: item.price,
        limit: item.limit
      });
      this.$bvToast.toast("Ürün düzenlendi", {
        title: "Düzenlendi.",
        autoHideDelay: 5000
      });
      item.editMode = false;
    }
  }
};
</script>
<style>
table {
  width: 100%;
}
.edit {
  border-bottom: 1px solid grey;
}
</style>