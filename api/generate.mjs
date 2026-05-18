export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST only' });
    }
    const name = (req.body && req.body.name || '').trim();
    if (!name) {
        return res.status(400).json({ error: '请输入名字' });
    }
    
    const apiKey = process.env.DEEPSEEK_API_KEY || '';
    
    // Try AI if key exists
    if (apiKey) {
        try {
            const prompt = '你是一个江湖称号生成器，用户名字是"' + name + '"，请按JSON格式返回：{"title":"四字霸气称号","full_title":"带书名号的称号","name":"' + name + '","rank":"江湖地位","detail":"一句古风描述","style":"武侠"}';
            const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{role:'user', content: prompt}],
                    temperature: 0.9,
                    max_tokens: 300
                })
            });
            if (resp.ok) {
                const data = await resp.json();
                const text = data.choices[0].message.content || '';
                const match = text.match(/\{.*\}/s);
                if (match) return res.status(200).json(JSON.parse(match[0]));
            }
        } catch(e) {
            // fallback
        }
    }
    
    // Local fallback  
    const p = ['一剑','九天','万古','乾坤','无极','太虚','苍穹','龙吟','凤鸣','皓月','星河'];
    const m = ['寒霜','惊鸿','破天','焚天','裂空','碎星','追风','踏雪','倚天','贯日','无双'];
    const s = ['十三式','九重天','万里行','三千界','百万兵','七星阵','八卦阵','六合掌'];
    const r = ['江湖散人','武林新秀','一代宗师','绝世高手','剑道通神','破碎虚空'];
    const d = ['剑法通神，名动天下','内力深厚，一掌可碎石','轻功卓绝，踏雪无痕','精通暗器，百发百中','拳法刚猛，大开大合'];
    
    const title = p[Math.floor(Math.random()*p.length)] + m[Math.floor(Math.random()*m.length)] + s[Math.floor(Math.random()*s.length)];
    return res.json({
        title, rank: r[Math.floor(Math.random()*r.length)], detail: d[Math.floor(Math.random()*d.length)],
        full_title: '\u300c' + title + '\u300d', name, style: '武侠'
    });
};