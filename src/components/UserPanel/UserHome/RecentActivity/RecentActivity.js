import React,{useState} from 'react'
import "./RecentActivity.css"

const RecentActivity = () => {
    const [navBar, setNavBar] = useState("All")
  return (
    <div className='RecentActivity'>
    <div className='RecentActivity__header'>
        <div className="RecentActivity__heading">Recent Activity</div>
        <div className="RecentActivity__times">13/03/2018 to 20/03/2018</div>
     </div>
     <div className='RecentActivity__navBar'>
        <div onClick={()=>setNavBar("All")} className={navBar==="All"? "RecentActivity__navBar__item__active" :'RecentActivity__navBar__item'}>All</div>
        <div onClick={()=>setNavBar("Enrolled")} className={navBar==="Enrolled"? "RecentActivity__navBar__item__active" :'RecentActivity__navBar__item'}>Enrolled</div>
        <div onClick={()=>setNavBar("Emails")} className={navBar==="Emails"? "RecentActivity__navBar__item__active" :'RecentActivity__navBar__item'}>Emails</div>
        <div onClick={()=>setNavBar("Quotes")} className={navBar==="Quotes"? "RecentActivity__navBar__item__active" :'RecentActivity__navBar__item'}>Quotes</div>
     </div>
     <div className='RecentActivity__list'>
        <div className='RecentActivity__list__left'>

        <div className='RecentActivity__list__icon'><img height="100%" width="100%" alt='icon' src='https://scontent.fkhi17-1.fna.fbcdn.net/v/t39.30808-6/288073231_2560673084063192_3991437020874167899_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeG6tTCEMQ2oMrAikKcql7OAm5_z0BbujFebn_PQFu6MV1mwODn_HeTX9ugWaJUIq2xIWWINnJ83E7ttZCLZ-Qm-&_nc_ohc=7n_f_1_U2dsAX_X7toC&tn=5PIo0pVkBB5bLGGo&_nc_ht=scontent.fkhi17-1.fna&oh=00_AT9RpcggPl8J5uQBsj_Ahg4WOCgcdcgHPVh31qLmczRTTg&oe=63582AF6' /></div>
        <div className='RecentActivity__list__heading'>
        Haris
        <div className='RecentActivity__list__sub__heading'>3 day ago</div>
        </div>
        </div>
     </div>
    </div>
  )
}

export default RecentActivity