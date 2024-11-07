

type Props = {
    data:{
        pointsAwarded:number,
        date:string
    }
}


function PopUp({data}: Props) {
  return (
    <div className="mb-3">
        <div>{'Date : '}{data.date}</div>
        <div>{'Points : '}{data.pointsAwarded}</div>
    </div>
  )
}

export default PopUp