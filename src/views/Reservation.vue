<template>
  <div>
    <b-modal id="modal-center" centered title="Kullanıcı Sözleşmesi">
      <p class="my-4">{{kvkk}}</p>
    </b-modal>

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
      <b-row>
        <b-col cols="auto">
          <b-form-checkbox
            v-model="status"
          ></b-form-checkbox>
        </b-col>
        <b-col cols="auto">
          <span variant="link">
            <span
              v-b-modal.modal-center
              style="color:blue ; cursor:pointer; text-decoration:underline"
            >Kullanıcı Sözleşmesi</span>ni okudum, onaylıyorum.
          </span>
        </b-col>
      </b-row>
      <b-row align-h="end">
        <b-col cols="auto">
          <b-button variant="link" @click="step = 1">Geri Dön</b-button>
          <b-button :disabled="!status" variant="success" @click="clickReservation">
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
      loading: false,
      status: false,
      kvkk: `SİTE KULLANIM ŞARTLARI Lütfen sitemizi kullanmadan evvel bu ‘site kullanım şartları’nı dikkatlice okuyunuz. Hotel App platformunu kullanan üyelerimiz aşağıdaki şartları kabul etmiş varsayılmaktadır: Sitemizdeki web sayfaları ve ona bağlı tüm sayfalar Hotel App'in malıdır ve onun tarafından işletilir. Sizler (‘Kullanıcı’) sitede sunulan tüm hizmetleri kullanırken aşağıdaki şartlara tabi olduğunuzu, sitedeki hizmetten yararlanmakla ve kullanmaya devam etmekle; Bağlı olduğunuz yasalara göre sözleşme imzalama hakkına, yetkisine ve hukuki ehliyetine sahip ve 18 yaşın üzerinde olduğunuzu, bu sözleşmeyi okuduğunuzu, anladığınızı ve sözleşmede yazan şartlarla bağlı olduğunuzu kabul etmiş sayılırsınız. İşbu sözleşme taraflara sözleşme konusu site ile ilgili hak ve yükümlülükler yükler ve taraflar işbu sözleşmeyi kabul ettiklerinde bahsi geçen hak ve yükümlülükleri eksiksiz, doğru, zamanında, işbu sözleşmede talep edilen şartlar dâhilinde yerine getireceklerini beyan ederler. 1. SORUMLULUKLAR a.Kulüp, etkinlikler, duyurular vs. üzerinde değişiklik yapma hakkını her zaman saklı tutar. b.Firma, üyenin sözleşme konusu hizmetlerden, teknik arızalar dışında yararlandırılacağını kabul ve taahhüt eder. c.Kullanıcı, sitenin kullanımında tersine mühendislik yapmayacağını ya da bunların kaynak kodunu bulmak veya elde etmek amacına yönelik herhangi bir başka işlemde bulunmayacağını aksi halde ve 3. Kişiler nezdinde doğacak zararlardan sorumlu olacağını, hakkında hukuki ve cezai işlem yapılacağını peşinen kabul eder. d.Kullanıcı, site içindeki faaliyetlerinde, sitenin herhangi bir bölümünde veya iletişimlerinde genel ahlaka ve adaba aykırı, kanuna aykırı, 3. Kişilerin haklarını zedeleyen, yanıltıcı, saldırgan, müstehcen, pornografik, kişilik haklarını zedeleyen, telif haklarına aykırı, yasa dışı faaliyetleri teşvik eden içerikler üretmeyeceğini, paylaşmayacağını kabul eder. Aksi halde oluşacak zarardan tamamen kendisi sorumludur ve bu durumda ‘Site’ yetkilileri, bu tür hesapları askıya alabilir, sona erdirebilir, yasal süreç başlatma hakkını saklı tutar. Bu sebeple yargı mercilerinden etkinlik veya kullanıcı hesapları ile ilgili bilgi talepleri gelirse paylaşma hakkını saklı tutar. e.Sitenin üyelerinin birbirleri veya üçüncü şahıslarla olan ilişkileri kendi sorumluluğundadır. 2. Fikri Mülkiyet Hakları 2.1. İşbu Site’de yer alan ünvan, işletme adı, marka, patent, logo, tasarım, bilgi ve yöntem gibi tescilli veya tescilsiz tüm fikri mülkiyet hakları site işleteni ve sahibi firmaya veya belirtilen ilgilisine ait olup, ulusal ve uluslararası hukukun koruması altındadır. İşbu Site’nin ziyaret edilmesi veya bu Site’deki hizmetlerden yararlanılması söz konusu fikri mülkiyet hakları konusunda hiçbir hak vermez. 2.2. Site’de yer alan bilgiler hiçbir şekilde çoğaltılamaz, yayınlanamaz, kopyalanamaz, sunulamaz ve/veya aktarılamaz. Site’nin bütünü veya bir kısmı diğer bir internet sitesinde izinsiz olarak kullanılamaz. 3. Gizli Bilgi 3.1. Kullanıcı, sadece tanıtım, reklam, kampanya, promosyon, duyuru vb. pazarlama faaliyetleri kapsamında kullanılması ile sınırlı olmak üzere, Site’nin sahibi olan firmanın kendisine ait iletişim, portföy durumu ve demografik bilgilerini iştirakleri ya da bağlı bulunduğu grup şirketleri ile paylaşmasına muvafakat ettiğini kabul ve beyan eder. Bu kişisel bilgiler firma bünyesinde müşteri profili belirlemek, müşteri profiline uygun promosyon ve kampanyalar sunmak ve istatistiksel çalışmalar yapmak amacıyla kullanılabilecektir. 4. Garanti Vermeme: İŞBU SÖZLEŞME MADDESİ UYGULANABİLİR KANUNUN İZİN VERDİĞİ AZAMİ ÖLÇÜDE GEÇERLİ OLACAKTIR. FİRMA TARAFINDAN SUNULAN HİZMETLER "OLDUĞU GİBİ” VE "MÜMKÜN OLDUĞU” TEMELDE SUNULMAKTA VE PAZARLANABİLİRLİK, BELİRLİ BİR AMACA UYGUNLUK VEYA İHLAL ETMEME KONUSUNDA TÜM ZIMNİ GARANTİLER DE DÂHİL OLMAK ÜZERE HİZMETLER VEYA UYGULAMA İLE İLGİLİ OLARAK (BUNLARDA YER ALAN TÜM BİLGİLER DÂHİL) SARİH VEYA ZIMNİ, KANUNİ VEYA BAŞKA BİR NİTELİKTE HİÇBİR GARANTİDE BULUNMAMAKTADIR. 5. Kayıt ve Güvenlik Kullanıcı, doğru, eksiksiz ve güncel kayıt bilgilerini vermek zorundadır. Aksi halde bu Sözleşme ihlal edilmiş sayılacak ve Kullanıcı bilgilendirilmeksizin hesap kapatılabilecektir. Kullanıcı, site ve üçüncü taraf sitelerdeki şifre ve hesap güvenliğinden kendisi sorumludur. Aksi halde oluşacak veri kayıplarından ve güvenlik ihlallerinden veya donanım ve cihazların zarar görmesinden Firma sorumlu tutulamaz. 6. Mücbir Sebep Tarafların kontrolünde olmayan; tabii afetler, yangın, patlamalar, iç savaşlar, savaşlar, ayaklanmalar, halk hareketleri, seferberlik ilanı, grev, lokavt ve salgın hastalıklar, altyapı ve internet arızaları, elektrik kesintisi gibi sebeplerden (aşağıda birlikte "Mücbir Sebep” olarak anılacaktır.) dolayı sözleşmeden doğan yükümlülükler taraflarca ifa edilemez hale gelirse, taraflar bundan sorumlu değildir. Bu sürede Taraflar’ın işbu Sözleşme’den doğan hak ve yükümlülükleri askıya alınır. 7. Sözleşmenin Bütünlüğü ve Uygulanabilirlik İşbu sözleşme şartlarından biri, kısmen veya tamamen geçersiz hale gelirse, sözleşmenin geri kalanı geçerliliğini korumaya devam eder. 8. Sözleşmede Yapılacak Değişiklikler Firma, dilediği zaman sitede sunulan hizmetleri ve işbu sözleşme şartlarını kısmen veya tamamen değiştirebilir. Değişiklikler sitede yayınlandığı tarihten itibaren geçerli olacaktır. Değişiklikleri takip etmek Kullanıcı’nın sorumluluğundadır. Kullanıcı, sunulan hizmetlerden yararlanmaya devam etmekle bu değişiklikleri de kabul etmiş sayılır. 9. Tebligat İşbu Sözleşme ile ilgili taraflara gönderilecek olan tüm bildirimler, Firma’nın bilinen e.posta adresi ve kullanıcının üyelik formunda belirttiği e.posta adresi vasıtasıyla yapılacaktır. Kullanıcı, üye olurken belirttiği adresin geçerli tebligat adresi olduğunu, değişmesi durumunda 5 gün içinde yazılı olarak diğer tarafa bildireceğini, aksi halde bu adrese yapılacak tebligatların geçerli sayılacağını kabul eder. 10. Delil Sözleşmesi Taraflar arasında işbu sözleşme ile ilgili işlemler için çıkabilecek her türlü uyuşmazlıklarda Taraflar’ın defter, kayıt ve belgeleri ile ve bilgisayar kayıtları ve faks kayıtları 6100 sayılı Hukuk Muhakemeleri Kanunu uyarınca delil olarak kabul edilecek olup, kullanıcı bu kayıtlara itiraz etmeyeceğini kabul eder. 11. Uyuşmazlıkların Çözümü İşbu Sözleşme’nin uygulanmasından veya yorumlanmasından doğacak her türlü uyuşmazlığın çözümünde İstanbul (Merkez) Adliyesi Mahkemeleri ve İcra Daireleri yetkilidir.`
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