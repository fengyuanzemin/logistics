import Handlebars from 'handlebars';

function judge10(num) {
    if (Number(num) < 10) {
        return `0${num}`;
    }
    return num;
}

// 是否完成，1完成，0未完成
Handlebars.registerHelper('isFinished', finish => (finish ? '完成' : '未完成'));

// 是否完成的tag判断
Handlebars.registerHelper('finishTagJudge', finish => (finish ? 'tag-success' : 'tag-warning'));

// 时间格式化
Handlebars.registerHelper('timeFormat', (time) => {
    const date = new Date(time);
    return `${date.getFullYear()}-${judge10(date.getMonth() + 1)}-${judge10(date.getDate())} ${judge10(date.getHours())}:${judge10(date.getMinutes())}`;
});

// 性别格式化
Handlebars.registerHelper('sexFormat', sex => (sex === 'm' ? '男' : '女'));

export default Handlebars;
