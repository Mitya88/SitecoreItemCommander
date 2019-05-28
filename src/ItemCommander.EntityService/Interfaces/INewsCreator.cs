using MikeRobbins.EntityServiceDemo.Models;
using Sitecore.Data.Items;

namespace MikeRobbins.EntityServiceDemo.Interfaces
{
    public interface INewsCreator
    {
        TemplateItem Template { get; set; }
        Item ParentItem { get; set; }
        void CreateNewsArticle(NewsArticle newsArticle);
    }
}