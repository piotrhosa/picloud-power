import smtplib
import mimetypes
from os.path import basename
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate

def send_mail(send_to, subject=None, text=None, file=None):
    sender_name = "GEMS for PiCloud"
    send_from = "gemspicloud@gmail.com"
    if subject is None: 
        subject = "GEMS Detected a Change"
    if text is None: 
        text = "Hi\n\nGEMS detected a change in the Raspberry Pi Cloud. Check the dashboard for details."
    
    msg = MIMEMultipart()
    msg['From'] = sender_name
    msg['To'] = send_to
    msg['Subject'] = subject

    msg.attach(MIMEText(text, 'plain'))

    if file is not None:

        ctype, encoding = mimetypes.guess_type(file)
        if ctype is None or encoding is not None:
            ctype = "application/octet-stream"

        maintype, subtype = ctype.split("/", 1)

        fp = open(file)
        attachment = MIMEText(fp.read(), _subtype=subtype)
        fp.close()
        attachment.add_header("Content-Disposition", "attachment", filename=file)
        msg.attach(attachment)

    server = smtplib.SMTP('smtp.gmail.com')
    server.ehlo()
    server.starttls()
    server.ehlo()
    server.login("gemspicloud", "gemsgems")
    server.sendmail(send_from, send_to, msg.as_string())
    server.close()