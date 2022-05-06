
url = 'https://www.youtube.com/watch?v=iXS3Zz0_4VY&ab_channel=FullFatVideos'
 #url = 'https://www.youtube.com/watch?v=XePsmBXpuqk&ab_channel=UnacademyNEET'

 newurl = url.replace('https://www.youtube.com/watch?v=', '')
 newurl = newurl.split("&ab_channel", 1)

 print(newurl[0])

from googleapiclient.discovery import build

api_key = 'AIzaSyALffU0NRLBe-jQPCnFDsl5uO6XP52HCJQ'

youtube = build('youtube', 'v3', developerKey=api_key)

request = youtube.videos().list(
        part='topicDetails',
        id = newurl[0]
    )
#youtube.videos().topicDetails().topicIds().list()

response = request.execute()

print(response)

res = response['items'][0]['topicDetails']['topicCategories']
#res = response['items'][0]['topicDetails']['topicCategories'][0]
res

for i in res:
  if ((i.find('game') != -1) or (i.find('movie') != -1) or (i.find('entertainment') != -1) or (i.find('tv') != -1)) :
      print ("Contains given substring ")
      break
  else:
      print ("Doesn't contains given substring")

#cat = request.args['cat]
cat="education,sport"

predictions = 0
cats = cat.split(",")
cats

for i in res:
  for j in cats:
    if j == "game":
      if ((i.find('game') != -1) or (i.find('gaming') != -1)):
        predictions = 1
        break
    elif j == "entertainment":
      if ((i.find('entertainment') != -1) or (i.find('movie') != -1) or (i.find('movies') != -1) or (i.find('film') != -1) or (i.find('films') != -1) or (i.find('tv') != -1)):
        predictions = 1
        break
    elif j == "sport":
      if ((i.find('sport') != -1) or (i.find('sports') != -1)):
        predictions = 1
        break
    elif j == "education":
      if ((i.find('education') != -1) or (i.find('knowledge') != -1) or (i.find('science') != -1) or (i.find('mathematics') != -1) or (i.find('academics') != -1)):
        predictions = 1
        break

predictions

game -> game, gaming
entertainment -> entertainment, movie, movies, film, films, tv
sport -> sport, sports
education -> knowledge, science, mathematics, academics

g = 0
  en = 0
  s = 0
  edu = 0
                        
  for i in res:
      if ((i.find('game') != -1) or (i.find('gaming') != -1) or (i.find('Game') != -1) or (i.find('Gaming') != -1)):
          g = 1
      if ((i.find('entertainment') != -1) or (i.find('movie') != -1) or (i.find('movies') != -1) or (i.find('film') != -1) or (i.find('films') != -1) or (i.find('tv') != -1) or (i.find('Entertainment') != -1) or (i.find('Movie') != -1) or (i.find('Movies') != -1) or (i.find('Film') != -1) or (i.find('Films') != -1) or (i.find('TV') != -1)):
          en = 1
      if ((i.find('sport') != -1) or (i.find('sports') != -1) or (i.find('Sport') != -1) or (i.find('Sports') != -1)):
          s = 1
      if ((i.find('education') != -1) or (i.find('knowledge') != -1) or (i.find('science') != -1) or (i.find('mathematics') != -1) or (i.find('academics') != -1) or (i.find('Education') != -1) or (i.find('Knowledge') != -1) or (i.find('Science') != -1) or (i.find('Mathematics') != -1) or (i.find('Academics') != -1)):
          edu = 1