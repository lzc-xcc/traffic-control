const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const riverBaseUrl = 'https://www.river.go.jp';

const prefectureUrls = {
    "北海道": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=43.3265&clon=141.9298&fld=0&mapType=0",
    "青森": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=40.8244&clon=140.7403&fld=0&mapType=0",
    "岩手": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=39.7184&clon=141.1512&fld=0&mapType=0",
    "宫城": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=38.2689&clon=140.8719&fld=0&mapType=0",
    "秋田": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=39.7139&clon=140.1167&fld=0&mapType=0",
    "山形": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=38.2406&clon=140.3636&fld=0&mapType=0",
    "福岛": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=37.7536&clon=140.4792&fld=0&mapType=0",
    "茨城": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=36.3414&clon=140.4468&fld=0&mapType=0",
    "栃木": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=36.5655&clon=139.8833&fld=0&mapType=0",
    "群马": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=36.3914&clon=139.0606&fld=0&mapType=0",
    "埼玉": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=35.9429&clon=139.6411&fld=0&mapType=0",
    "千叶": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=35.5034&clon=140.1275&fld=0&mapType=0",
    "东京": "https://www.river.go.jp/kawabou/pc/tm?zm=12&clat=35.6895&clon=139.6917&fld=0&mapType=0",
    "神奈川": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=35.4437&clon=139.6489&fld=0&mapType=0",
    "山梨": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=35.6638&clon=138.5689&fld=0&mapType=0",
    "长野": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=36.6513&clon=138.1814&fld=0&mapType=0",
    "岐阜": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=35.3912&clon=136.7222&fld=0&mapType=0",
    "静冈": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=34.9794&clon=138.3831&fld=0&mapType=0",
    "爱知": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=35.1815&clon=136.9067&fld=0&mapType=0",
    "三重": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=34.7303&clon=136.5094&fld=0&mapType=0",
    "滋贺": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=35.0044&clon=135.8689&fld=0&mapType=0",
    "京都": "https://www.river.go.jp/kawabou/pc/tm?zm=12&clat=35.0116&clon=135.7681&fld=0&mapType=0",
    "大阪": "https://www.river.go.jp/kawabou/pc/tm?zm=12&clat=34.6937&clon=135.5023&fld=0&mapType=0",
    "奈良": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=34.6864&clon=135.8322&fld=0&mapType=0",
    "和歌山": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=34.2261&clon=135.3689&fld=0&mapType=0",
    "鸟取": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=35.5326&clon=133.5064&fld=0&mapType=0",
    "岛根": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=35.4722&clon=132.8833&fld=0&mapType=0",
    "冈山": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=34.6617&clon=133.9364&fld=0&mapType=0",
    "广岛": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=34.3964&clon=132.4598&fld=0&mapType=0",
    "山口": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=34.1858&clon=131.4794&fld=0&mapType=0",
    "德岛": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=34.0658&clon=134.5594&fld=0&mapType=0",
    "香川": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=34.3406&clon=133.7397&fld=0&mapType=0",
    "爱媛": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=33.8417&clon=132.7689&fld=0&mapType=0",
    "高知": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=33.5597&clon=133.5319&fld=0&mapType=0",
    "福冈": "https://www.river.go.jp/kawabou/pc/tm?zm=12&clat=33.5898&clon=130.4102&fld=0&mapType=0",
    "佐贺": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=33.3656&clon=130.3003&fld=0&mapType=0",
    "长崎": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=33.2497&clon=129.8792&fld=0&mapType=0",
    "熊本": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=32.7898&clon=130.7417&fld=0&mapType=0",
    "大分": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=33.2497&clon=131.6003&fld=0&mapType=0",
    "宫崎": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=31.9111&clon=131.4231&fld=0&mapType=0",
    "鹿儿岛": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=31.5606&clon=130.5578&fld=0&mapType=0",
    "冲绳": "https://www.river.go.jp/kawabou/pc/tm?zm=11&clat=26.2124&clon=127.6809&fld=0&mapType=0"
};

const generateMockData = (prefecture) => {
    const rivers = {
        "北海道": ["石狩川", "天塩川", "十胜川"],
        "青森": ["青森川", "岩木川", "津軽海峡"],
        "岩手": ["北上川", "岩手川", "雫石川"],
        "宫城": ["広瀬川", "阿武隈川", "仙台川"],
        "秋田": ["雄物川", "出羽川", "湯川"],
        "山形": ["最上川", "山形川", "荒川"],
        "福岛": ["阿武隈川", "只见川", "須川"],
        "茨城": ["利根川", "鬼怒川", "常陸川"],
        "栃木": ["鬼怒川", "那珂川", "益子川"],
        "群马": ["利根川", "荒川", "碓氷川"],
        "埼玉": ["荒川", "入間川", "鴻巣川"],
        "千叶": ["江戸川", "利根川", "九十九里浜"],
        "东京": ["荒川", "多摩川", "隅田川"],
        "神奈川": ["相模川", "鶴見川", "大和川"],
        "山梨": ["富士川", "日川", "桂川"],
        "长野": ["千曲川", "木曽川", "天竜川"],
        "岐阜": ["木曽川", "揖斐川", "長良川"],
        "静冈": ["富士川", "安倍川", "大井川"],
        "爱知": ["木曽川", "矢作川", "渥美川"],
        "三重": ["木曽川", "伊勢川", "紀ノ川"],
        "滋贺": ["琵琶湖", "宇治川", "木津川"],
        "京都": ["鴨川", "宇治川", "桂川"],
        "大阪": ["淀川", "大和川", "木津川"],
        "奈良": ["大和川", "吉野川", "明日香川"],
        "和歌山": ["紀ノ川", "有田川", "那智川"],
        "鸟取": ["千代川", "日野川", "気多川"],
        "岛根": ["宍道湖", "出雲川", "斐伊川"],
        "冈山": ["旭川", "吉井川", "高梁川"],
        "广岛": ["太田川", "広島湾", "江田島川"],
        "山口": ["錦川", "岩国川", "下関湾"],
        "德岛": ["吉野川", "那賀川", "阿波川"],
        "香川": ["高松港", "讃岐川", "丸亀川"],
        "爱媛": ["四万十川", "肱川", "新居浜川"],
        "高知": ["四万十川", "仁淀川", "土佐湾"],
        "福冈": ["筑後川", "那珂川", "糸満川"],
        "佐贺": ["佐賀川", "唐津湾", "伊万里川"],
        "长崎": ["長崎港", "島原湾", "諫早川"],
        "熊本": ["球磨川", "菊池川", "阿蘇川"],
        "大分": ["大分川", "日田川", "別府湾"],
        "宫崎": ["大淀川", "宮崎川", "日南海岸"],
        "鹿儿岛": ["川内川", "薩摩川", "奄美大島"],
        "冲绳": ["那覇湾", "首里川", "浦添川"]
    };

    const riverName = rivers[prefecture] || ["河川"];
    const baseLevel = Math.random() * 2 + 1;
    
    return {
        waterLevel: [
            { 
                name: `${riverName[0]}・${prefecture}`, 
                level: (baseLevel + Math.random() * 0.5).toFixed(2) + "m", 
                time: new Date().toLocaleString('ja-JP'),
                status: baseLevel > 2.5 ? "注意" : "正常",
                trend: (Math.random() - 0.5) * 0.1
            },
            { 
                name: `${riverName[1] || riverName[0]}・近郊`, 
                level: (baseLevel + Math.random() * 0.3 - 0.15).toFixed(2) + "m", 
                time: new Date().toLocaleString('ja-JP'),
                status: "正常",
                trend: (Math.random() - 0.5) * 0.08
            },
            { 
                name: `${riverName[2] || riverName[0]}・周辺`, 
                level: (baseLevel + Math.random() * 0.4 - 0.2).toFixed(2) + "m", 
                time: new Date().toLocaleString('ja-JP'),
                status: "正常",
                trend: (Math.random() - 0.5) * 0.05
            }
        ],
        waterChart: {
            title: `${prefecture}地区水位趋势图`,
            data: Array(7).fill(baseLevel).map((v, i) => (v + Math.random() * 0.3 - 0.15 + i * 0.02).toFixed(2)),
            labels: ["10:00", "11:00", "12:00", "13:00", "14:00", "14:15", "14:30"],
            warningLevel: 3.5,
            alertLevel: 4.5
        },
        crossSection: {
            river: riverName[0],
            location: `${prefecture}中心部`,
            width: (Math.random() * 100 + 80).toFixed(0) + "m",
            maxDepth: (Math.random() * 5 + 5).toFixed(1) + "m",
            avgDepth: (Math.random() * 3 + 2).toFixed(1) + "m",
            flowRate: (Math.random() * 100 + 50).toFixed(0) + " m³/s",
            waterTemp: (Math.random() * 10 + 10).toFixed(1) + "°C",
            depthProfile: Array(7).fill(0).map((_, i) => {
                const mid = 3;
                return (Math.random() * 3 + (1 - Math.abs(i - mid) * 0.2)).toFixed(1);
            }),
            velocityProfile: Array(7).fill(0).map((_, i) => {
                const mid = 3;
                return (Math.random() * 0.5 + (1 - Math.abs(i - mid) * 0.15)).toFixed(1);
            })
        },
        cameras: [
            { 
                id: `CAM${Math.random().toString(36).substr(2, 8).toUpperCase()}`, 
                name: `${riverName[0]}・観測点1`, 
                location: `${prefecture}東部`,
                url: prefectureUrls[prefecture] || prefectureUrls["东京"]
            },
            { 
                id: `CAM${Math.random().toString(36).substr(2, 8).toUpperCase()}`, 
                name: `${riverName[0]}・観測点2`, 
                location: `${prefecture}西部`,
                url: prefectureUrls[prefecture] || prefectureUrls["东京"]
            }
        ],
        dam: {
            name: `${prefecture}ダム`,
            location: `${prefecture}北部`,
            capacity: (Math.random() * 5000 + 1000).toFixed(0) + "万m³",
            waterLevel: (Math.random() * 50 + 150).toFixed(1) + "m",
            maxLevel: (Math.random() * 30 + 200).toFixed(1) + "m",
            storageRate: (Math.random() * 40 + 50).toFixed(1) + "%",
            discharge: (Math.random() * 10 + 2).toFixed(1) + "m³/s",
            inflow: (Math.random() * 20 + 5).toFixed(1) + "m³/s",
            safetyLevel: (Math.random() * 20 + 180).toFixed(1) + "m",
            emergencyLevel: (Math.random() * 10 + 190).toFixed(1) + "m"
        },
        rainfall: {
            current: (Math.random() * 20).toFixed(1),
            hourly: Array(12).fill(0).map(() => (Math.random() * 15).toFixed(1)),
            forecast: {
                type: ["快晴", "晴れ", "曇り", "曇時々雨", "雨"][Math.floor(Math.random() * 5)],
                maxRain: (Math.random() * 50 + 10).toFixed(0),
                probability: (Math.random() * 80 + 20).toFixed(0)
            }
        }
    };
};

app.get('/api/data/:prefecture', async (req, res) => {
    const prefecture = decodeURIComponent(req.params.prefecture);
    
    try {
        res.json(generateMockData(prefecture));
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/cities/:prefecture', (req, res) => {
    const prefecture = decodeURIComponent(req.params.prefecture);
    
    const cities = {
        "北海道": ["札幌市", "旭川市", "函馆市", "钏路市", "带广市", "小樽市", "北见市", "室兰市"],
        "青森": ["青森市", "弘前市", "八户市", "黑石市", "五所川原市", "十和田市", "三泽市"],
        "岩手": ["盛冈市", "宫古市", "大船渡市", "花卷市", "北上市", "久慈市", "二户市"],
        "宫城": ["仙台市", "石卷市", "气仙沼市", "盐灶市", "多贺城市", "松岛町", "名取市"],
        "秋田": ["秋田市", "能代市", "横手市", "大馆市", "男鹿市", "汤泽市", "鹿角市"],
        "山形": ["山形市", "米泽市", "鹤冈市", "酒田市", "新庄市", "上山市", "天童市"],
        "福岛": ["福岛市", "郡山市", "磐城市", "白河市", "须贺川市", "会津若松市", "二本松市"],
        "茨城": ["水户市", "日立市", "土浦市", "古河市", "石冈市", "筑波市", "常总市"],
        "栃木": ["宇都宫市", "足利市", "日光市", "小山町", "真冈市", "鹿沼市", "下野市"],
        "群马": ["前桥市", "高崎市", "太田市", "沼田市", "涩川市", "安中市", "富冈市"],
        "埼玉": ["埼玉市", "川口市", "蕨市", "户田市", "入间市", "所泽市", "越谷市"],
        "千叶": ["千叶市", "船桥市", "松户市", "市原市", "流山市", "柏市", "习志野市"],
        "东京": ["千代田区", "中央区", "港区", "新宿区", "涩谷区", "池袋", "银座"],
        "神奈川": ["横滨市", "川崎市", "相模原市", "横须贺市", "藤泽市", "平塚市", "厚木市"],
        "山梨": ["甲府市", "富士吉田市", "南阿尔卑斯市", "山梨市", "笛吹市", "韭崎市"],
        "长野": ["长野市", "松本市", "上田市", "饭田市", "冈谷市", "小诸市", "佐久市"],
        "岐阜": ["岐阜市", "多治见市", "土岐市", "瑞浪市", "美浓加茂市", "飞驒市"],
        "静冈": ["静冈市", "滨松市", "富士市", "沼津市", "清水町", "三岛市", "伊东市"],
        "爱知": ["名古屋市", "丰田市", "冈崎市", "丰桥市", "清须市", "春日井市", "小牧市"],
        "三重": ["津市", "四日市市", "伊势市", "松阪市", "铃鹿市", "龟山市", "桑名市"],
        "滋贺": ["大津市", "彦根市", "长滨市", "近江八幡市", "草津市", "守山市"],
        "京都": ["京都市", "宇治市", "伏见区", "左京区", "东山区", "西山区", "舞鹤市"],
        "大阪": ["大阪市", "堺市", "丰中市", "吹田市", "池田市", "高槻市", "枚方市"],
        "奈良": ["奈良市", "大和高田市", "天理市", "樱井市", "明日香村", "吉野町"],
        "和歌山": ["和歌山市", "海南市", "有田市", "御坊市", "串本町", "白滨町"],
        "鸟取": ["鸟取市", "米子市", "仓吉市", "境港市", "岩美町", "琴浦町"],
        "岛根": ["松江市", "出云市", "滨田市", "益田市", "大田市", "安来市"],
        "冈山": ["冈山市", "仓敷市", "津山市", "玉野市", "备前市", "总社市"],
        "广岛": ["广岛市", "吴市", "尾道市", "三原市", "福山市", "东广岛市"],
        "山口": ["山口市", "下关市", "宇部市", "防府市", "岩国市", "周南市"],
        "德岛": ["德岛市", "鸣门市", "小松岛市", "阿南市", "吉野川市", "三好市"],
        "香川": ["高松市", "丸龟市", "坂出市", "善通寺市", "观音寺市", "东香川市"],
        "爱媛": ["松山市", "今治市", "宇和岛市", "西条市", "大洲市", "新居浜市"],
        "高知": ["高知市", "安芸市", "南国市", "须崎市", "土佐清水市", "四万十市"],
        "福冈": ["福冈市", "北九州市", "久留米市", "筑后市", "柳川市", "大牟田市"],
        "佐贺": ["佐贺市", "唐津市", "伊万里市", "鹿岛市", "太良町", "吉野里町"],
        "长崎": ["长崎市", "佐世保市", "岛原市", "谏早市", "平户市", "对马市"],
        "熊本": ["熊本市", "鹿本郡", "宇土市", "八代市", "水俣市", "菊池市"],
        "大分": ["大分市", "别府市", "中津市", "日田市", "佐伯市", "臼杵市"],
        "宫崎": ["宫崎市", "延冈市", "日南市", "小林市", "西都市", "串间市"],
        "鹿儿岛": ["鹿儿岛市", "奄美市", "川内市", "萨摩川内市", "雾岛市", "枕崎市"],
        "冲绳": ["那霸市", "冲绳市", "宜野湾市", "浦添市", "宇流麻市", "石垣市"]
    };
    
    res.json(cities[prefecture] || []);
});

app.use(express.static('.'));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});