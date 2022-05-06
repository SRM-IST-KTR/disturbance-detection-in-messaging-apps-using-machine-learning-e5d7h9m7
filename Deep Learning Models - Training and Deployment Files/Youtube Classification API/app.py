
from flask import Flask, jsonify
from flask import request
from googleapiclient.discovery import build


app = Flask(__name__)

# routes
@app.route('/predict', methods=['GET', 'POST'])
def predict():
    # get data
    
    #data = request.get_json
    data = request.args['t']
    
    newurl = data.replace('https://www.youtube.com/watch?v=', '')
    newurl = newurl.split("&ab_channel", 1)

    api_key = 'AIzaSyALffU0NRLBe-jQPCnFDsl5uO6XP52HCJQ'
    youtube = build('youtube', 'v3', developerKey=api_key)

    request1 = youtube.videos().list(
            part='topicDetails',
            id = newurl[0]
        )
    response = request1.execute()
    res = response['items'][0]['topicDetails']['topicCategories']

    g = 0
    en = 0
    s = 0
    edu = 0
                       
    for i in res:
      if ((i.find('game') != -1) or (i.find('gaming') != -1)):
        g = 1
      if ((i.find('entertainment') != -1) or (i.find('movie') != -1) or (i.find('movies') != -1) or (i.find('film') != -1) or (i.find('films') != -1) or (i.find('tv') != -1)):
        en = 1
      if ((i.find('sport') != -1) or (i.find('sports') != -1)):
        s = 1
      if ((i.find('education') != -1) or (i.find('knowledge') != -1) or (i.find('science') != -1) or (i.find('mathematics') != -1) or (i.find('academics') != -1)):
        edu = 1
    
    output = {'games': g
             'entertainment': en
             'sports': s
             'education': edu}
    
    return jsonify(results=output)

@app.errorhandler(500)
def internal_error(error):

    return "500 error"

if __name__ == '__main__':
    app.run(port = 5000, debug=True)
