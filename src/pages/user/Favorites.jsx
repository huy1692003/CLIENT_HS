import { memo, useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import favoritesService from "../../services/favoritesService"
import { userState } from "../../recoil/atom"
import CardFavorites from "../../components/user/CardFavorites"
import { data } from "autoprefixer"

const Favorites = () => {
    const [favoties, setFavorites] = useState([])
    const cus = useRecoilValue(userState)

    useEffect(() => {
        if (cus) {
            getHomeStayFavorites(cus)
        }
    }, [cus])

    const getHomeStayFavorites = async (cus) => {
        let res = await favoritesService.getHomeStayFavorites(cus?.idCus || 1)
        setFavorites(res)
        console.log(res)
    }

    console.log(favoties)
    return (
        <>
            <div className="text-3xl font-bold text-center mt-10 mb-5 py-5 rounded-2xl" style={{ backgroundColor: '#F5F5F5' }}>
                Danh sách yêu thích của bạn

            </div>

            <div>
                {
                    favoties.length === 0 ? <div>Bạn chưa có Homestays yêu thích nào</div> :
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {favoties.map(f => <CardFavorites  data={{favoriteID:f.favoriteID,homestay:f.homestay,detailHomeStay:f.detailHomeStay,rooms:f.rooms}}  refeshData={getHomeStayFavorites} />)}
                        </div>
                }
            </div>
        </>
    )
}
export default memo(Favorites)