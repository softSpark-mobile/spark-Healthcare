
import { View ,Text} from "react-native";


export const imagedata = [
    {
        id: 1,
        mapimage:
            "https://img.freepik.com/premium-vector/car-icon-vehicle-icon-car-vector-icon_564974-1452.jpg",
    },
    {
        id: 2,
        mapimage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzZoSYmVnFOyNvcNAWJjgMFKLhSPMuTge7WYqBxFVg3w0gVeTWJ-f_j76oInX4v7CRLLo&usqp=CAU",
    },
    {
        id: 3,
        mapimage:
            "https://png.pngtree.com/png-clipart/20190614/original/pngtree-vector-health-icon-png-image_3782846.jpg",
    },
    {
        id: 4,
        mapimage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfLAFLtjcueG-tS2D1OG-7VV3jys9kMP_QlpAF1pjC5alSpGCHsLAwBr2huKpH3EBDFWg&usqp=CAU",
    },
    {
        id: 5,
        mapimage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe2D2YUZGFjA16c3N2mZ3NI0Qu2YRlo-ub2jkMKf3vIu112QuEijL2Xvt8Qcmj9d-88Xw&usqp=CAU",
    },
    {
        id: 6,
        mapimage:
            "https://c1.klipartz.com/pngpicture/539/707/sticker-png-electricity-symbol-electrical-energy-electric-power-electrical-engineering-bluebonnet-electric-cooperative-electric-power-distribution-electric-energy-consumption-green.png",
    },
    {
        id: 7,
        mapimage:
            "https://vectorstate.com/stock-photo-preview/131676314/350/ist_28469_01579.jpg",
    },
    {
        
        id: 8,
        mapimage:
            "https://png.pngtree.com/element_our/png/20181114/salary-flat-icon-png_238371.jpg",
    },
    {
        id: 9,
        mapimage:
            "https://previews.123rf.com/images/deimosz/deimosz1506/deimosz150600012/41571096-red-sale-icon-aufkleber-einloggen-oder-banner-auf-wei%C3%9Fen-hintergrund.jpg",
    },
    {
        id: 10,
        mapimage:
            "https://img.freepik.com/premium-vector/coupon-icon-coupon-discount-promotion-sale-shopping-voucher-money-saving-shopping-concept_97458-1054.jpg",
    },
    {
        id: 11,
        mapimage:
            "https://cdn-icons-png.freepik.com/512/17123/17123527.png",
    },
    {
        id: 12,
        mapimage:
            "https://cdn-icons-png.freepik.com/256/748/748484.png?ga=GA1.1.554353898.1701922326&semt=ais_hybrid",
    },
    {
        id: 13,
        mapimage:
            "https://cdn-icons-png.freepik.com/256/11499/11499710.png?ga=GA1.1.554353898.1701922326&semt=ais_hybrid",
    },
    {
        id: 14,
        mapimage:
            "data:image/png;base64,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",
    },
    {
        id: 15,
        mapimage:
            "https://cdn-icons-png.flaticon.com/128/3066/3066259.png",
    },
];



export const imagemap = [
    {
        id: "1",
        mapimage:
            "https://e7.pngegg.com/pngimages/644/118/png-clipart-karur-vysya-bank-logo-round-bank-logos-thumbnail.png",
    },
    {
        id: "2",
        mapimage: "https://cdn.iconscout.com/icon/free/png-256/free-sbi-225865.png",
    },
    {
        id: "3",
        mapimage:
            "https://w7.pngwing.com/pngs/246/850/png-transparent-canara-bank-loan-branch-andhra-bank-bank-angle-triangle-branch.png",
    },
    {
        id: "4",
        mapimage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2NkNYdtSYQ3Jl2XivHt7PgDyBAiILnhh4W35-KdO6MYY1Ft76XUau9YsSkHhoy3cE10&usqp=CAU",
    },
    {
        id: "5",
        mapimage:
            "https://w1.pngwing.com/pngs/670/83/png-transparent-india-design-icici-bank-icici-bank-canada-mobile-banking-privatesector-banks-in-india-finance-icici-prudential-mutual-fund-recurring-deposit.png",
    },
];

export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
export const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const EmptyDay = () => {
    return (
        <View style={{flex:1,backgroundColor:'red'}}>
            <Text>Loading.....</Text>
        </View>
    )
};


export const addnewaccount = [
    {
      id: "1",
      mapimage:
        "https://e7.pngegg.com/pngimages/644/118/png-clipart-karur-vysya-bank-logo-round-bank-logos-thumbnail.png",
    },
    {
      id: "2",
      mapimage: "https://cdn.iconscout.com/icon/free/png-256/free-sbi-225865.png",
    },
    {
      id: "3",
      mapimage:
        "https://w7.pngwing.com/pngs/246/850/png-transparent-canara-bank-loan-branch-andhra-bank-bank-angle-triangle-branch.png",
    },
    {
      id: "4",
      mapimage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2NkNYdtSYQ3Jl2XivHt7PgDyBAiILnhh4W35-KdO6MYY1Ft76XUau9YsSkHhoy3cE10&usqp=CAU",
    },
    {
      id: "5",
      mapimage:
        "https://w1.pngwing.com/pngs/670/83/png-transparent-india-design-icici-bank-icici-bank-canada-mobile-banking-privatesector-banks-in-india-finance-icici-prudential-mutual-fund-recurring-deposit.png",
    },
  ];

 export const addcategoryimagedata = [
    {
      id: 1,
      mapimage:
        "https://img.freepik.com/premium-vector/car-icon-vehicle-icon-car-vector-icon_564974-1452.jpg",
    },
    {
      id: 2,
      mapimage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzZoSYmVnFOyNvcNAWJjgMFKLhSPMuTge7WYqBxFVg3w0gVeTWJ-f_j76oInX4v7CRLLo&usqp=CAU",
    },
    {
      id: 3,
      mapimage:
        "https://png.pngtree.com/png-clipart/20190614/original/pngtree-vector-health-icon-png-image_3782846.jpg",
    },
    {
      id: 4,
      mapimage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfLAFLtjcueG-tS2D1OG-7VV3jys9kMP_QlpAF1pjC5alSpGCHsLAwBr2huKpH3EBDFWg&usqp=CAU",
    },
    {
      id: 5,
      mapimage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe2D2YUZGFjA16c3N2mZ3NI0Qu2YRlo-ub2jkMKf3vIu112QuEijL2Xvt8Qcmj9d-88Xw&usqp=CAU",
    },
    {
      id: 6,
      mapimage:
        "https://c1.klipartz.com/pngpicture/539/707/sticker-png-electricity-symbol-electrical-energy-electric-power-electrical-engineering-bluebonnet-electric-cooperative-electric-power-distribution-electric-energy-consumption-green.png",
    },
    {
      id: 7,
      mapimage:
        "https://vectorstate.com/stock-photo-preview/131676314/350/ist_28469_01579.jpg",
    },
    {
      id: 8,
      mapimage:
        "https://png.pngtree.com/element_our/png/20181114/salary-flat-icon-png_238371.jpg",
    },
    {
      id: 9,
      mapimage:
        "https://previews.123rf.com/images/deimosz/deimosz1506/deimosz150600012/41571096-red-sale-icon-aufkleber-einloggen-oder-banner-auf-wei%C3%9Fen-hintergrund.jpg",
    },
    {
      id: 10,
      mapimage:
        "https://img.freepik.com/premium-vector/coupon-icon-coupon-discount-promotion-sale-shopping-voucher-money-saving-shopping-concept_97458-1054.jpg",
    },
  ];
