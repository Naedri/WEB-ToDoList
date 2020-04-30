import moment from 'moment';
import 'moment/locale/fr';


export const calculateDays = (date) => {
    moment.locale('fr');
    let formatedDate = moment(date);
    // get from-now for this date
    let fromNow = moment(formatedDate).fromNow();
    // ensure the date is displayed with today and yesterday
    return moment(formatedDate).calendar(null, {
        // when the date is closer, specify custom values
        lastWeek: 'dddd [dernier]',
        lastDay: '[Hier]',
        sameDay: '[Aujourd\'hui]',
        nextDay: '[Demain]',
        nextWeek: 'dddd',
        // when the date is further away, use from-now functionality             
        sameElse: function () {
            return "[" + fromNow + "]";
        }
    });
}
