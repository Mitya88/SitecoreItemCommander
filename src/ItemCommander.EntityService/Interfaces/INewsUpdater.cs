using MikeRobbins.EntityServiceDemo.Models;
using Sitecore.Data.Items;

namespace MikeRobbins.EntityServiceDemo.Interfaces
{
    public interface INewsUpdater
    {
        void UpdateNewsArticle(NewsArticle newsArticle);
        void DeleteNewsArticle(NewsArticle newsArticle);
    }
}