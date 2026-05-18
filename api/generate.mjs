export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, style } = req.body || {};
    if (!name || !name.trim()) {
        return res.status(400).json({ error: '请输入你的名字' });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    const prompt = style === '修仙' 
        ? 你是一个修仙称号生成器。用户的名字是""。请为他生成一个酷炫的修仙/仙侠称号，格式要求：{"title":"四字或六字的霸气称号","full_title":"带书名号的完整称号","name":"","rank":"修仙境界评价","detail":"一句简短描述","style":"修仙"}。要求有修仙味。只用JSON回复。
        : 你是一个江湖称号生成器。用户的名字是""。请为他生成一个酷炫的武侠江湖称号，格式要求：{"title":"四字或六字的霸气称号","full_title":"带书名号的完整称号","name":"","rank":"江湖地位评价","detail":"一句简短的带古风人物描述","style":"武侠"}。称号要霸气有画面感。只用JSON回复。;

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': Bearer ,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.9,
                max_tokens: 300
            })
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        const jsonMatch = content.match(/\{.*\}/s);
        
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return res.status(200).json(result);
        }

        // Fallback local generation
        const prefixes = ["一剑","九天","万古","乾坤","无极","太虚","苍穹"];
        const middles = ["寒霜","惊鸿","破天","焚天","裂空","碎星"];
        const suffixes = ["十三式","九重天","万里行","三千界","百万兵"];
        const ranks = ["江湖散人","武林新秀","一代宗师","绝世高手"];
        const details = ["剑法通神，名动天下","内力深厚，一掌可碎石","轻功卓绝，踏雪无痕"];

        const title = prefixes[Math.floor(Math.random()*prefixes.length)] + 
                     middles[Math.floor(Math.random()*middles.length)] + 
                     suffixes[Math.floor(Math.random()*suffixes.length)];

        return res.status(200).json({
            title: title,
            full_title: '\u300c' + title + '\u300d',
            name: name,
            rank: ranks[Math.floor(Math.random()*ranks.length)],
            detail: details[Math.floor(Math.random()*details.length)],
            style: style || '武侠'
        });
    } catch (e) {
        return res.status(500).json({ error: '生成失败，请重试' });
    }
}
