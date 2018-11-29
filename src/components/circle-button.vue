<template>
<div class="wrapper">
  <input class="hidden-trigger" id="toogle" type="checkbox">
  <label class="circle" for="toogle">
     <img src="https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/2x/btw_ic_speeddial_white_24dp_2x.png" alt="" />
  </label>
  <div class="subs">
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub1" type="radio" name="sub-circle" value="1"/>
      <label for="sub1">
        <img src="https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/2x/btw_ic_speeddial_white_24dp_2x.png" alt="" />
      </label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub2" type="radio" name="sub-circle" value="1"/>
      <label for="sub2"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub3" type="radio" name="sub-circle" value="1"/>
      <label for="sub3"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub4" type="radio" name="sub-circle" value="1"/>
      <label for="sub4"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub5" type="radio" name="sub-circle" value="1"/>
      <label for="sub5"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub6" type="radio" name="sub-circle" value="1"/>
      <label for="sub6"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub7" type="radio" name="sub-circle" value="1"/>
      <label for="sub7"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub8" type="radio" name="sub-circle" value="1"/>
      <label for="sub8"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub8" type="radio" name="sub-circle" value="1"/>
      <label for="sub8"></label>
    </button>
   </div>
</div>
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
//colors
$bg: #EEEEEE
$circle: #3F51B5
$sub-circle: #F50057

.wrapper
//   position: absolute
//   top: 50%
//   left: 50%
//   transform: translate(-50%, -50%)
  width: 60px
  height: 60px

.circle
  display: block
  position: relative
  padding: 0
  z-index: 98
  margin: 0 auto
  -webkit-box-shadow: 0 6px 10px 0 rgba(0,0,0,0.3)
  box-shadow: 0 6px 10px 0 rgba(0,0,0,0.3)
  border-radius: 50%
  height: 60px
  width: 60px
  background-color: $circle
  transition: 0.2s
  text-align: center
  &:active
    transform: scale(0.90)
    box-shadow: 0 2px 15px 0 rgba(0,0,0,0.3)
  &:hover
    cursor: pointer
    background-color: lighten($circle, 10%)
    box-shadow: 0 8px 15px 0 rgba(0,0,0,0.3)

  img
    position: absolute
    top: 50%
    left: 50%
    margin-left: -15px
    margin-top: -15px
    width: 30px
    height: 30px
    transition: 0.5s
    transform: rotate(180deg)

.sub-circle
  z-index: 0
  position: absolute
  height: 40px
  width: 40px
  overflow: hidden
  border-radius: 50%
  transition: 0.3s
  transform: scale(0.5)
  opacity: 0
  padding: 0
  margin: 0
  box-shadow: 0 6px 10px 0 rgba(0,0,0,0.3)
  label
    background-color: $sub-circle
    display: block
    color: white
    width: 100%
    height: 100%
    line-height: 40px
    transition: 200ms
    &:hover
      cursor: pointer
      background-color: lighten($circle, 10%)
    img
        position: absolute
        top: 50%
        left: 50%
        margin-left: -15px
        margin-top: -15px
        width: 30px
        height: 30px
        transition: 0.5s
        transform: rotate(180deg)
.subs
  left: -20px
  top: -50px
  width: 40px
  height: 40px
  text-align: center
  z-index: 0
  margin: 0 auto
  position: relative

$transition: 0.1
$transalteValue: 100
$translate75: $transalteValue*0.75

.hidden-sub-trigger
  display: none
  &:checked ~ label
    background-color: lighten($circle, 10%)

.hidden-trigger
  display: none
  &:checked ~ .circle
    transform: scale(0.90)
    cursor: pointer
    background-color: lighten($circle, 10%)
    box-shadow: 0 8px 15px 0 rgba(0,0,0,0.1)
  &:checked ~ .circle img
    transform: rotate(45deg)
  &:checked ~ .subs button:nth-of-type(1)
    transform: translate(0px, -$transalteValue + px) scale(1)
    opacity: 1
    transition: $transition + s
  &:checked ~ .subs button:nth-of-type(2)
    transform: translate($translate75 + px, -$translate75 + px) scale(1)
    opacity: 1
    transition: $transition * 2 + s
  &:checked ~ .subs button:nth-of-type(3)
    transform: translate($transalteValue + px, 0px) scale(1)
    opacity: 1
    transition: $transition * 3 + s
  &:checked ~ .subs button:nth-of-type(4)
    transform: translate($translate75 + px, $translate75 + px) scale(1)
    opacity: 1
    transition: $transition * 4 + s
  &:checked ~ .subs button:nth-of-type(5)
    transform: translate(0px, $transalteValue + px) scale(1)
    opacity: 1
    transition: $transition * 5 + s
  &:checked ~ .subs button:nth-of-type(6)
    transform: translate(-$translate75 + px, $translate75 + px) scale(1)
    opacity: 1
    transition: $transition * 6 + s
  &:checked ~ .subs button:nth-of-type(7)
    transform: translate(-$transalteValue + px, 0px) scale(1)
    opacity: 1
    transition: $transition * 7 + s
  &:checked ~ .subs button:nth-of-type(8)
    transform: translate(-$translate75 + px, -$translate75 + px) scale(1)
    opacity: 1
    transition: $transition * 8 + s
</style>
