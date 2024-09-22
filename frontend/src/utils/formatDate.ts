import moment from "moment";

export default function formatDate(date: string | Date | undefined) {
    return moment(date).format("MMM D, YYYY, \xa0hh:mm A");
}
