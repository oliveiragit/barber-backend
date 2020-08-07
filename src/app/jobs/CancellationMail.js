const {format, parseISO} = require ('date-fns');
const brazilLocale = require ('date-fns/locale/pt');

const Mail = require('../../lib/Mail');

class CancellationMail{
  get key(){
    return 'CancellationMail'
  }

  async handle({data}){
 
    const { appointment } = data;
    Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO( appointment.date), "'dia' dd 'de' MMMM', às' H:mm'h'",{
          locale: brazilLocale,
        })
      }
    });
  }
}
module.exports = new CancellationMail();