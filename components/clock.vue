<template>
  <div class="h-96 flex justify-center items-center">
    <div class=" p-24">
      <p class="text-4xl">{{ date }}</p>
      <p class="text-9xl">{{ time }}</p>
    </div>
  </div>
</template>
<script setup>
import moment from 'moment';
const time = ref('00:00:00');
const date = ref('00-00-0000');
var timerID = setInterval(updateTime, 1000);
moment.locale('fr', {
  months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split('_'),
  monthsShort: 'Janv._Févr._Mars_Avr._Mai_Juin_Juil._Août_Sept._Oct._Nov._Déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
  weekdaysShort: 'Dim._Lun._Mar._Mer._Jeu._Ven._Sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
})
updateTime();

function updateTime() {
  var cd = new Date();
  time.value = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
  // display date as 30 décembre 2024 not 30 12 2024 with moment js
  date.value = moment(cd).format('dddd Do MMMM YYYY');


 // date.value = week[cd.getDay()] + ' ' + zeroPadding(cd.getDate(), 2) + '/' + zeroPadding(cd.getMonth() + 1, 2) + '/' + zeroPadding(cd.getFullYear(), 4);
};

function zeroPadding(num, digit) {
  var zero = '';
  for (var i = 0; i < digit; i++) {
    zero += '0';
  }
  return (zero + num).slice(-digit);
}

</script>