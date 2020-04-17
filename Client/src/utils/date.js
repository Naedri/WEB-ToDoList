import moment from 'moment';
import 'moment/locale/fr';


export const calculateDays = (date) => {
    moment.locale('fr');
    let formatedDate = moment(date);
    return moment(formatedDate).fromNow();
}
