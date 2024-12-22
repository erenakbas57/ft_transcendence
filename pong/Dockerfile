FROM python:latest

ENV PIP_ROOT_USER_ACTION=ignore \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

COPY ./ /pong

RUN pip install --upgrade pip && pip install -r ./pong/req.txt
RUN chmod +x ./pong/start.sh
RUN chmod +x ./pong/wait-for-it.sh
EXPOSE 8000

WORKDIR /pong
CMD [ "sh", "./start.sh" ]


