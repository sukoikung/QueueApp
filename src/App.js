import React, { useEffect } from 'react';
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import jsonData from './config.json'
import useSound from 'use-sound'
import stable from './sounds/table.mp3'
import zero from './sounds/0.mp3';
const customStyles = {
  content: {
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement');

function App() {

  const [urlHeader, seturlHeader] = React.useState("")
  const [urlStorage, seturlStorage] = React.useState("")
  const [userId, setuserId] = React.useState("")
  const [displayReverse, setdisplayReverse] = React.useState([])
  const [dept, setdept] = React.useState("")
  const [dept_name, setdept_name] = React.useState("")
  const [dept_code, setdept_code] = React.useState("")
  const [vdept, setvdept] = React.useState("")
  const [vdept_name, setvdept_name] = React.useState("")
  const [monitor_id, setmonitor_id] = React.useState("")
  const [monitor_code, setmonitor_code] = React.useState("")
  const [protocalList, setprotocalList] = React.useState([])
  const [waitingList, setwaitingList] = React.useState([])
  const [pendingCall, setpendingCall] = React.useState([])
  const [virsualDept, setvirsualDept] = React.useState([])
  const [limit_his, setlimit_his] = React.useState(4)
  const [limit_wait, setlimit_wait] = React.useState(6)
  const [monitor_select, setmonitor_select] = React.useState([])
  const [unit_select, setunit_select] = React.useState([])
  const [unit_name, setunit_name] = React.useState('')
  const [monitorList, setmonitorList] = React.useState([])
  const [monitorListUnit, setmonitorListUnit] = React.useState([])
  const [uniList, setuniList] = React.useState([])
  const [checkmodal, setcheckmodal] = React.useState(false)
  let num = 0;
  let q_codes = "0";
  let q_codesss = "1";
  let checkplay = false;
  let datacalllist = []
  let monitorcalllist = []
  let checkqueu = []

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);


  useEffect(() => {
    // Update the document title using the browser API
    checkupdate();
    ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.LANDSCAPE)
  }, []);

  function openModal() {
    getapi()
    setmonitor_code('')
    setprotocalList([])
    setmonitorList([])
    setIsOpen(true);

  }

  function closeModal() {
    setIsOpen(false);
  }

  function checkupdate() {
    seturlHeader(jsonData['urlHeader'])
    setuserId(jsonData['userId'])
    setdisplayReverse(jsonData['displayReverse'])
    setdept(jsonData['dept'])
    setdept_name(jsonData['dept_name'])
    setmonitor_id(jsonData['monitor_id'])
    setmonitor_code(jsonData['monitor_code'])
    setdept_code(jsonData['dept_code'])
    setmonitor_select(jsonData['monitor_select'])
    setunit_select(jsonData['unit_select'])
    seturlStorage(jsonData['urlStorage'])

  }

  function playAudio(player, src) {
    // let song = new Audio(src);
    player.src = src
    player.pause();
    player.load();
    return player.play();
  }

  function audioplay2(data) {
    let audioPath = './sounds/'
    q_codes = data[0].queue_code
    let playlist = generatePlaylist(data[0].queue_code, data[0].identity_code, data[0].sound_call);
    let playerIndex = 0;
    const audioPlayer = document.querySelector('audio');
    let playPromise = playAudio(audioPlayer, audioPath + playlist[playerIndex]);
    audioPlayer.addEventListener('ended', function () {
      playerIndex++;
      if (playerIndex) {
        if ((playerIndex % 2) == 0) {
          document.querySelector(".queue-prototype-box").style.backgroundColor = "#FFFFFF";
          document.querySelector(".custom-color").style.backgroundColor = "#FFFFFF";
        }
        if ((playerIndex % 2) != 0) {
          document.querySelector(".queue-prototype-box").style.backgroundColor = "#71B7FF";
          document.querySelector(".custom-color").style.backgroundColor = "#71B7FF";
        }
      }
      if (playerIndex === playlist.length) {
        console.log(data[0].call_id)
        fetch(urlHeader + "/api/public-thai-his/flow-runtime?flow_id=1619579538063724300&req=2&qid=" + data[0].call_id)
          .then(res => res.json())
          .then(
            (result) => {
              console.log("yes")
              datacalllist.shift()
              if(datacalllist.length != 0){
                audioplay(datacalllist)
              }else{
                checkplay = false
              }
              
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              console.log("101010")
              datacalllist.shift()
              if(datacalllist.length != 0){
                audioplay(datacalllist)
              }else{
                checkplay = false
              }
            }
          )
        // audioPlayer.removeEventListener('ended');
        // resolve(true);
      } else {
        let playPromise = playAudio(audioPlayer, audioPath + playlist[playerIndex]);
        if (playPromise !== undefined) {
          playPromise.then(function () {
          }).catch(function (error) {
            console.error('playlist', playPromise);
          });
        }
      }
    })
  }

  function audioplay(data) {
    monitorcalllist.unshift(data[0])
    setprotocalList(monitorcalllist)
    let audioPath = './sounds/'
    q_codes = data[0].queue_code
    let playlist = generatePlaylist(data[0].queue_code, data[0].identity_code, data[0].sound_call);
    let playerIndex = 0;
    const audioPlayer = document.querySelector('audio');
    let playPromise = playAudio(audioPlayer, audioPath + playlist[playerIndex]);
    audioPlayer.addEventListener('ended', function () {
      playerIndex++;
      if (playerIndex) {
        if ((playerIndex % 2) == 0) {
          document.querySelector(".queue-prototype-box").style.backgroundColor = "#FFFFFF";
          document.querySelector(".custom-color").style.backgroundColor = "#FFFFFF";
        }
        if ((playerIndex % 2) != 0) {
          document.querySelector(".queue-prototype-box").style.backgroundColor = "#71B7FF";
          document.querySelector(".custom-color").style.backgroundColor = "#71B7FF";
        }
      }
      if (playerIndex === playlist.length) {
        audioplay2(data)
        // audioPlayer.removeEventListener('ended');
        // resolve(true);
      } else {
        let playPromise = playAudio(audioPlayer, audioPath + playlist[playerIndex]);
        if (playPromise !== undefined) {
          playPromise.then(function () {
          }).catch(function (error) {
            console.error('playlist', playPromise);
          });
        }
      }
    })
  }


  function getapi() {
    setprotocalList([])
    setmonitor_code('')
    fetch(urlHeader + "/api/public-thai-his/flow-runtime?flow_id=1620888434034048000&dept_id=" + dept)
      .then(res => res.json())
      .then(
        (result) => {
          setuniList(result['data']['unit_list'])
          setvirsualDept(result['data']['monitor_list'])

        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("99999")
        }
      )
  }



  function handleSelectChange(event) {
    let datas = [];
    setunit_select(event.target.value.split('/')[1])
    virsualDept.map((val) => {
      if (val.unit_id == event.target.value.split('/')[0]) {
        datas.push(val)
      }
    })

    setmonitorListUnit(datas)

  }

  function handleSelectChange2(event) {
    setmonitor_code(event.target.value)

  }


  async function getqueuecall() {
    monitorcalllist = []
    await fetch(urlHeader + "/api/public-thai-his/flow-runtime?flow_id=1619579538063724300&monitor_code=" + monitor_code + "&dept_id=" + dept + "&req=1")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          setmonitorList(result['data']['queueList'])
          if (result['data']['monitorCallList'].length != 0) {
            result['data']['monitorCallList'].map((val) => {
              if (val.call_status == 'PENDING') {
                console.log(val)
                datacalllist.push(val)
              } else {

                monitorcalllist.unshift(val)
              }
            }


            )
            
            if (datacalllist.length != 0) {
              q_codesss = datacalllist[0].queue_code
              if (num > 2 && q_codes != q_codesss) {
                num = 0
              }
              if (num > 2) {
                document.querySelector(".queue-prototype-box").style.backgroundColor = "#71B7FF";
                document.querySelector(".custom-color").style.backgroundColor = "#71B7FF";
              }
              setTimeout(() => {
                if (datacalllist.length != 0 && q_codes != q_codesss) {
                  checkplay = true
                  audioplay(datacalllist)
                }

              }, 1000);
            }
            setprotocalList(monitorcalllist)
          }else{
            setprotocalList(monitorcalllist)
          }

        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("666")
        }
      )
  }
  function settimte() {
    const timeValue = setInterval(() => {
      if (checkplay == false) {
        getqueuecall()
      }
    }, 2000);

  }
  async function submit() {

    closeModal()
    setunit_name(unit_select)
    const a = await getqueuecall()
    settimte()
    setcheckmodal(true)
    // const b = await audioplay()
  }



  function generatePlaylist(queueLabel, roomNumber, sound) {
    setvdept_name(queueLabel)
    let audioMapping = {
      'call': 'media.io_call.mp3',
      'room': 'media.io_room.mp3',
      'room2': 'room.mp3',
      'ka': 'ka.mp3',
      'table': 'table.mp3',
      'point_service': 'point_service.mp3',
      'media.io_room': 'media.io_room.mp3',
      'er': 'er.mp3',
      'at': 'at.mp3',
      'Q': 'Q.mp3',
      '0': '0.mp3',
      '1': '1.mp3',
      '2': '2.mp3',
      '3': '3.mp3',
      '4': '4.mp3',
      '5': '5.mp3',
      '6': '6.mp3',
      '7': '7.mp3',
      '8': '8.mp3',
      '9': '9.mp3',
      'L': 'L.mp3',
      'W': 'W.mp3',
      'E': 'E.mp3',
      'A': 'A.mp3',
      'W': 'W.mp3',
    };
    let playlist = [];
    let splitWord = queueLabel.split('');
    playlist.push(audioMapping['call']);
    for (let char of splitWord) {
      playlist.push(char + ".mp3");
    }

    if (sound) {
      let t1 = sound.split(',')
      let t2 = String(t1[0].replace(/['"]+/g, ''))
      let t3 = String(t1[1].replace(/['"]+/g, ''))
      let t4 = String(t1[2].replace(/['"]+/g, ''))

      playlist.push(audioMapping[String(t2).replace('[', '')]);
      playlist.push(audioMapping[String(t3)]);
      playlist.push(audioMapping[String(t4).replace(']', '')]);
    } else {
      if (roomNumber != null && roomNumber !== '' && roomNumber !== 'จุดบริการ') {
        playlist.push(audioMapping['table']);
        playlist.push(audioMapping['at']);
        playlist.push(audioMapping[roomNumber]);
      } else {
        playlist.push(audioMapping['at']);
        playlist.push(audioMapping['room2']);
        playlist.push(audioMapping['er']);
      }
    }



    playlist.push(audioMapping['ka']);
    return playlist;
  }
  function reload() {
    window.location.reload()
  }
  return (
    <div id="app">
      <audio id="queue-audio-player" src type="audio/mpeg" autoPlay />
      <div style={{ paddingLeft: "50px", paddingTop: "10px" }}>
        <div >
          <img className="custom-logo" src="imgs/logo.png" />

          {checkmodal == true ? <button style={{ float: "right", marginTop: "25px", marginRight: "50px" }} className="btn btn-light" onClick={reload}><i className="fa fa-refresh" /></button> : <button style={{ float: "right", marginTop: "25px", marginRight: "50px" }} className="btn btn-light" onClick={openModal}><i className="fa fa-cog" /></button>}
          <h4 id="dept_name" style={{ fontWeight: 'bold', float: "right", marginTop: "30px", marginRight: "20px" }}>{unit_name}</h4>
        </div>
      </div>
      <hr style={{ paddingTop: '0px', marginTop: '5px', marginBottom: '0px' }} />
      <div style={{ backgroundColor: '#334F6D' }}>
        <div className="container-fuild">
          {unit_name == '' ? <h4 style={{ textAlign: 'center', backgroundColor: '#2370BE', padding: '10px', color: '#ffffff' }}>คิวผู้ป่วยรอตรวจ
            (<span id="unit-name-label" />0)</h4> : <h4 style={{ textAlign: 'center', backgroundColor: '#2370BE', padding: '10px', color: '#ffffff' }}>คิวผู้ป่วยรอตรวจ
              (<span id="unit-name-label" />{monitorList.length})</h4>}
          {/* <h1 style={{ textAlign: 'center', backgroundColor: '#2370BE', padding: '10px', color: '#ffffff' }}>คิวผู้ป่วยรอตรวจ
            (<span id="unit-name-label" />{monitorList.length})</h1> */}
          {/*DYNAMIC TYPE */}
          <div className="flex-container" id="root-flex-container">
          </div>
          <div className="flex-container queue-content-header">
            <span className="col-md-6 queue-col">เลขคิว</span>
            <span className="col-md-6 queue-col">ห้องตรวจ</span>
            {/* <span class="col-md-3 queue-col">รายการคิวที่รอ</span> */}
          </div>

          <div className="queue-content-box center-block flex-container">
            <span className="col-md-12 " id="content-queue-history" style={{ padding: 0 }}>

              {protocalList.length > 0 ? <div id="prototype-box" className="prototype-box row">

                {protocalList.slice(0,4).map(fbb =>
                  <>
                    <span className="col-md-5  " id="box-queue-history1">
                      <div className=" flex-item-dynamic queue-prototype-box">
                        <label >{fbb.q_code}</label>
                      </div>
                    </span>
                    <span className="col-md-7 " id="box-queue-history2">
                      <div className=" flex-item-dynamic queue-prototype-box custom-color">
                        <label>{fbb.sp_name}</label>
                      </div>
                    </span>
                  </>
                )}
              </div> : null}
            </span>
            {/* <span class="col-md-3" id="content-queue-list" style="padding: 0;">
                <div hidden id="prototype-box-small" class=" flex-item-dynamic queue-prototype-box-small">
                    <label>M0002</label>
                </div>
        </span> */}
          </div>
        </div>
        <p className="text-center " style={{ marginTop: '10px',marginBottom: '0px', fontSize: '17px', color: '#FFFFFF' }}>
          ให้บริการตามลำดับก่อนหลังดังนี้</p>
      </div>
      {/* Modal */}

      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={customStyles}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}></h2>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">ตั้งค่าจอแสดงผล</h5>
          <button type="button" className="close btn-close-modal" aria-label="Close" onClick={closeModal}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="row form-group">
            <div className="col-md-12">
              <label>หน่วยงาน</label>
              <select className="form-control" name="dept_id" id="select_dept" onChange={handleSelectChange} >
                <option value={0}>Please select department</option>
                {uniList.map(fbb =>
                  <option value={fbb.id + "/" + fbb.unit_code + " " + fbb.unit_name}>{fbb.unit_code + " " + fbb.unit_name}</option>
                )}
              </select>
              <input type="hidden" value="unit_select" name="dept_name" />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <label>จอแสดงคิว</label>
              <select className="form-control" id="select_monitor" name="monitor_id" onChange={handleSelectChange2}>
                <option value={0}>Please select monitoring</option>
                {monitorListUnit.map(fbb =>
                  <option value={fbb.mor_code}>{fbb.mor_name}</option>
                )};
              </select>
              <input type="hidden" value="monitor_select" name="monitor_name" />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <label>Thaihis URL</label>
              <input type="text" name="urlHeader" value={urlHeader} className="form-control" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary btn-close-modal" onClick={closeModal}>Close</button>
          <button type="submit" className="btn btn-primary" onClick={submit}>Save changes</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;