from youtube_transcript_api import YouTubeTranscriptApi


class VideoService:
    @staticmethod
    def get_script(video_id):
        return YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
