<template>
  <div>
    <!--------------------------------- Search Bar  --------------------------------->
    <a-row :gutter="24" style="margin-bottom: 20px">
      <!--------------------------------- sido select  --------------------------------->
      <a-col :span="6">
        <a-select v-model="sidocode" style="width: 100%" @change="sidoChange">
          <a-select-option
            v-for="(sido, index) in sidoList"
            :key="index"
            rowKey="index"
            :value="sido.code"
            >{{ sido.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <!--------------------------------- /sido select  --------------------------------->
      <!--------------------------------- gugun select  --------------------------------->
      <a-col :span="6">
        <a-select v-model="guguncode" style="width: 100%" @change="gugunChange">
          <a-select-option
            v-for="(gugun, index) in gugunList"
            :key="index"
            :value="gugun.code"
            >{{ gugun.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <!--------------------------------- /gugun select  --------------------------------->
      <!--------------------------------- input  --------------------------------->
      <a-col :span="6">
        <a-input
          placeholder="아파트 이름 검색"
          v-model="inputName"
          enter-button
          @search="search"
        >
        </a-input>
      </a-col>
      <!--------------------------------- /input  --------------------------------->

      <!--------------------------------- search  --------------------------------->
      <a-col :span="2">
        <a-button type="primary" style="margin-bottom: 0px" @click="search"
          >search</a-button
        >
      </a-col>
      <!--------------------------------- /search  --------------------------------->

      <!--------------------------------- filter  --------------------------------->
    </a-row>
    <a-row :gutter="24" style="margin-bottom: 20px">
      <a-col :span="1">
        <h5><strong>Filter</strong></h5>
      </a-col>

      <!--------------------------------- area filter  --------------------------------->
      <a-col :span="2">
        <a-row style="text-align: center"><h6>평수</h6></a-row>
        <a-select v-model="areaFilter" default-value="all" style="width: 100%">
          <a-select-option value="0"> 전체 </a-select-option>
          <a-select-option value="1"> 20평이하 </a-select-option>
          <a-select-option value="2"> 20평대 </a-select-option>
          <a-select-option value="3"> 30평대 </a-select-option>
          <a-select-option value="4"> 40평이상 </a-select-option>
        </a-select>
      </a-col>
      <!--------------------------------- /area filter  --------------------------------->
      <!--------------------------------- floor filter  --------------------------------->
      <a-col :span="2">
        <a-row style="text-align: center"><h6>층수</h6></a-row>
        <a-select v-model="floorFilter" default-value="all" style="width: 100%">
          <a-select-option value="0"> 전체 </a-select-option>
          <a-select-option value="1"> 5층 미만 </a-select-option>
          <a-select-option value="2"> 5층 이상 </a-select-option>
          <a-select-option value="3"> 10층 이상 </a-select-option>
        </a-select>
      </a-col>
      <!--------------------------------- /floor filter  --------------------------------->
      <!--------------------------------- dealAmount filter  --------------------------------->
      <a-col :span="2">
        <a-row style="text-align: center"><h6>매매가격</h6></a-row>
        <a-select
          v-model="dealAmountFilter"
          default-value="all"
          style="width: 100%"
        >
          <a-select-option value="0"> 전체 </a-select-option>
          <a-select-option value="1"> 5억 미만 </a-select-option>
          <a-select-option value="2"> 5억 이상 </a-select-option>
          <a-select-option value="3"> 10억 이상 </a-select-option>
        </a-select>
      </a-col>
      <!--------------------------------- /dealAmount filter  --------------------------------->
    </a-row>
    <!--------------------------------- /filter  --------------------------------->

    <!--------------------------------- /Search Bar  --------------------------------->

    <!--------------------------------- kakao map  --------------------------------->
    <a-row :gutter="24">
      <a-col :span="24">
        <div
          style="
            width: 100%;
            height: 700px;
            margin-bottom: 30px;
            text-align: center;
          "
        >
          <strong>kakao map</strong>
          <div id="map"></div>
        </div>
      </a-col>
    </a-row>

    <!--------------------------------- /kakao map  --------------------------------->

    <!--------------------------------- table  --------------------------------->
    <a-row type="flex" :gutter="24">
      <a-col :span="24">
        <draw-house-table
          :data="data"
          @clickRecord="clickRecord"
          @showStarbucks="showStarbucks"
        ></draw-house-table>
      </a-col>
    </a-row>
    <!--------------------------------- /table  --------------------------------->
  </div>
</template>

<script>
import DrawHouseTable from "../components/MapComponent/DrawHouseTable";
import http from "@/api/http";

var map;
var starbucksMarkers = [];

function getDistance(lat1, lng1, lat2, lng2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

export default {
  components: {
    DrawHouseTable,
  },

  props: {
    aptName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      map: null,
      markers: [],
      markerArr: [],
      starbucksMarkers: [],
      centerSetting: false,
      sidoList: [{ code: "default", name: "시/도 선택" }],
      sidocode: "default",
      gugunList: [{ code: "default", name: "구/군 선택" }],
      guguncode: "default",

      infos: [],
      // input apart name
      inputName: "",
      // filter
      areaFilter: "0",
      floorFilter: "0",
      dealAmountFilter: "0",
      data: [],
    };
  }, // end of data
  created() {
    this.getSidoList();
    if (this.$props.aptName != " ") {
      this.interestApartNameSearch(this.$props.aptName);
    }
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=8273ad75e4cf13f650633b14013a60c0&libraries=services";
      document.head.appendChild(script);
    }
  },
  watch: {
    infos: function (curr, prev) {
      this.eraseMarkers();
      this.updateMarkers();
    },
    clickRecord: function (record) {
      console.log("clickrecord : ", record);
      let position = new kakao.maps.LatLng(
        this.clickRecord.lat,
        this.clickRecord.lng
      );
      this.map.setCenter(position);
    },
  },
  methods: {
    interestApartNameSearch: function (apartname) {
      console.log("interest search", apartname);
      http.post("/resthouse/nameSearch/" + apartname).then(({ data }) => {
        //          console.log(data);
        this.infos = data;
        this.data = data;
      });
    },

    initMap() {
      console.log("initMap");
      var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
      var options = {
        //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        level: 4, //지도의 레벨(확대, 축소 정도)
      };
      this.map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
      map = this.map;
    },
    getSidoList() {
      console.log("get sido list");
      http.get("/region/sido").then(({ data }) => {
        data.forEach((element) => {
          this.sidoList.push(element);
        });
      });
    },
    sidoChange() {
      console.log("sido change");
      const code = this.sidocode;
      this.gugunList = [{ code: "default", name: "구/군 선택" }];
      http.get("/region/gugun/" + code).then(({ data }) => {
        data.forEach((element) => {
          this.gugunList.push(element);
        });
      });
    },
    gugunChange() {
      console.log("gugun change");
    },
    search: function () {
      console.log("serach button");
      console.log(
        "filter",
        this.areaFilter,
        this.floorFilter,
        this.dealAmountFilter
      );
      console.log("codes : ", this.sidocode, this.guguncode);

      const param = JSON.stringify({
        gugunCode: this.guguncode,
        inputName: this.inputName,
        area: this.areaFilter,
        floor: this.floorFilter,
        dealAmount: this.dealAmountFilter,
      });
      console.log(param);
      var headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      };
      http
        .post("/resthouse/filterSearch", param, { headers })
        .then(({ data }) => {
          //          console.log(data);
          this.infos = data;
          this.data = data;
        });
    },

    updateMarkers: function () {
      console.log("update markers", this.infos);
      this.markers = [];

      // 중복 마커 생성 방지
      let uniqueAptCodes = [];
      this.infos.forEach((element) => {
        const aptcode = element.aptCode;
        if (!uniqueAptCodes.includes(aptcode)) {
          uniqueAptCodes.push(aptcode);
          this.markers.push(element);
        }
      });

      this.positionMarkers();
    },

    positionMarkers: function () {
      this.markers.forEach((element, index) => {
        let position = new kakao.maps.LatLng(element.lat, element.lng);

        var imageSrc = "images/house.png",
          imageSize = new kakao.maps.Size(50, 50), // 마커이미지의 크기입니다
          imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        var marker = new kakao.maps.Marker({
          map: map,
          position: position,
          image: markerImage,
          info: element,
          clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
        });

        var iwContent =
          '<div style="width:150px; padding:5px; text-align : center"><strong>' +
          element.aptName +
          "</strong><br>" +
          element.dongName +
          "<br>" +
          "</div>"; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

        // 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
          removable: true,
        });
        kakao.maps.event.addListener(marker, "mouseover", function () {
          // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
          infowindow.open(map, marker);
        });

        // 마커에 마우스아웃 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, "mouseout", function () {
          // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
          infowindow.close();
        });

        kakao.maps.event.addListener(marker, "click", function () {
          // 클릭한 위도, 경도 정보를 가져옵니다
          map.setCenter(marker.getPosition());
        });

        marker.setMap(map);
        this.markerArr.push(marker);
        if (index == 0) this.map.setCenter(position);
      });
    },

    eraseMarkers: function () {
      console.log("erase markers", this.markerArr);

      this.markerArr.forEach((element) => {
        element.setMap(null);
      });
      starbucksMarkers.forEach((element) => {
        element.marker.setMap(null);
      });
    },
    clickRecord(record) {
      console.log("click reord", record);
      let position = new kakao.maps.LatLng(record.lat, record.lng);
      this.map.setCenter(position);
    },

    showStarbucks(info) {
      this.eraseStarbucksMarker();
      http.get("/starbucks/search/" + info.dongCode).then(({ data }) => {
        console.log("starbucks list", data);

        var geocoder = new kakao.maps.services.Geocoder();

        let minDistance = 987654321;

        data.forEach((element) => {
          const address = element.address;
          geocoder.addressSearch(address, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
              var position = new kakao.maps.LatLng(result[0].y, result[0].x);

              // 위도, 경도 좌표를 사용한 거리계산 결과를 통해 가장 가까운 스타벅스로 중심 이동
              let distance = getDistance(
                info.lat,
                info.lng,
                result[0].y,
                result[0].x
              );
              if (distance < minDistance) {
                minDistance = distance;
                map.setCenter(position);
              }

              var imageSrc = "images/starbucks-icon.png",
                imageSize = new kakao.maps.Size(50, 50), // 마커이미지의 크기입니다
                imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

              // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
              var markerImage = new kakao.maps.MarkerImage(
                imageSrc,
                imageSize,
                imageOption
              );

              var marker = new kakao.maps.Marker({
                map: map,
                position: position,
                image: markerImage,
              });

              starbucksMarkers.push({
                info: element,
                marker: marker,
              });

              var iwContent =
                '<div style="padding:5px;">' +
                element.name +
                "<br>" +
                element.address +
                "</div>"; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

              // 인포윈도우를 생성합니다
              var infowindow = new kakao.maps.InfoWindow({
                content: iwContent,
              });
              kakao.maps.event.addListener(marker, "mouseover", function () {
                // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
                infowindow.open(map, marker);
              });
              // 마커에 마우스아웃 이벤트를 등록합니다
              kakao.maps.event.addListener(marker, "mouseout", function () {
                // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
                infowindow.close();
              });
              kakao.maps.event.addListener(marker, "click", function () {
                // 클릭한 위도, 경도 정보를 가져옵니다
                map.setCenter(marker.getPosition());
              });
              marker.setMap(map);
            }
          });
        });
      });
    },
    eraseStarbucksMarker() {
      starbucksMarkers.forEach((element) => {
        element.marker.setMap(null);
      });
      starbucksMarkers = [];
    },
  },
}; // end of export
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
